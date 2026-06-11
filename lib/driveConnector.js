// ============================================================
// FILE: lib/driveConnector.js
// PURPOSE: Google Drive sync — save and open files from the
//          user's own Google Drive storage
// LAST CHANGED: 11 Jun 2026
// WHY IT EXISTS: Users who sign in with Google get free 15GB
//               cloud sync. Their files live in their Drive —
//               not our servers. We are the key, not the vault.
// DEPENDENCIES: lib/supabase.js for auth token retrieval,
//               lib/analytics.js for event logging
// ⚠️ DO NOT CHANGE: FOLDER_NAME — changing this means existing
//                   user files in Drive become invisible to the app
//                   never store file content in Supabase storage —
//                   Drive only for file content
//                   always check for folder before creating —
//                   never create duplicate ForgeYours folders
// ============================================================

import { supabase } from '@/lib/supabase';
import { logEvent, EVENTS } from '@/lib/analytics';

const FOLDER_NAME = 'ForgeYours';
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';

// ─── GET ACCESS TOKEN ─────────────────────────────────────────
// Retrieves the Google OAuth access token from the current
// Supabase session. Returns null if user is not signed in.

async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.provider_token ?? null;
}

// ─── GET OR CREATE FORGEYOURS FOLDER ─────────────────────────
// Finds the ForgeYours folder in the user's Drive.
// Creates it if it does not exist.
// Returns the folder id.

async function getOrCreateFolder(token) {
  // Search for existing folder first
  const searchRes = await fetch(
    `${DRIVE_API}/files?q=name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const searchData = await searchRes.json();

  if (searchData.files?.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder if not found
  const createRes = await fetch(`${DRIVE_API}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });
  const folder = await createRes.json();
  return folder.id;
}

// ─── SAVE TO DRIVE ────────────────────────────────────────────
// Saves file content to Google Drive inside the ForgeYours folder.
// If a file with the same driveFileId exists, updates it.
// If not, creates a new file and returns the new driveFileId.
//
// Usage:
//   const driveFileId = await saveToDrive({
//     name: 'My Document.txt',
//     content: '...',
//     mimeType: 'text/plain',
//     driveFileId: existingId ?? null,
//     tool: 'write',
//   });

export async function saveToDrive({
  name,
  content,
  mimeType = 'text/plain',
  driveFileId = null,
  tool = 'unknown',
}) {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in to Google');

  await logEvent(EVENTS.SAVE_DRIVE, { tool });

  const blob = new Blob([content], { type: mimeType });

  if (driveFileId) {
    // Update existing file
    await fetch(`${UPLOAD_API}/files/${driveFileId}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': mimeType,
      },
      body: blob,
    });
    return driveFileId;

  } else {
    // Create new file in ForgeYours folder
    const folderId = await getOrCreateFolder(token);

    const metadata = {
      name,
      parents: [folderId],
    };

    const form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    form.append('file', blob);

    const res = await fetch(
      `${UPLOAD_API}/files?uploadType=multipart&fields=id`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      }
    );
    const data = await res.json();
    return data.id;
  }
}

// ─── OPEN FROM DRIVE ─────────────────────────────────────────
// Lists all files in the ForgeYours folder for a given tool.
// Returns array of { id, name, modifiedTime }
//
// Usage:
//   const files = await listDriveFiles('write');

export async function listDriveFiles(tool) {
  const token = await getAccessToken();
  if (!token) return [];

  await logEvent(EVENTS.OPEN_DRIVE, { tool });

  const folderId = await getOrCreateFolder(token);

  const res = await fetch(
    `${DRIVE_API}/files?q='${folderId}' in parents and trashed=false&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  return data.files ?? [];
}

// ─── READ FILE FROM DRIVE ─────────────────────────────────────
// Downloads and returns the content of a Drive file by id.
//
// Usage:
//   const content = await readDriveFile(driveFileId);

export async function readDriveFile(driveFileId) {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in to Google');

  const res = await fetch(
    `${DRIVE_API}/files/${driveFileId}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.text();
}

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial tool template
// REASON: Google Drive connector — user's own storage, our tool
//         is just the interface. Files never touch our servers.
//         Folder named ForgeYours so user can find their files
//         directly in Drive even without the app.
// --- END CHANGE LOG ---
