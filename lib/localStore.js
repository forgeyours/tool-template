// ============================================================
// FILE: lib/localStore.js
// PURPOSE: Local file storage using IndexedDB via idb library
// LAST CHANGED: 11 Jun 2026
// WHY IT EXISTS: Every ForgeYours tool stores files locally
//               by default. No server involved. Files survive
//               browser restarts and work fully offline.
//               IndexedDB chosen over localStorage because it
//               handles gigabytes vs localStorage's 5MB limit.
// DEPENDENCIES: idb library (in package.json)
// ⚠️ DO NOT CHANGE: DB_NAME and STORE_NAME — changing these
//                   orphans existing user files in old stores
//                   never store file content in Supabase —
//                   local first, Drive second, never our servers
// ============================================================

import { openDB } from 'idb';

const DB_NAME = 'forgeyours-files';
const DB_VERSION = 1;
const STORE_NAME = 'files';

// ─── OPEN DATABASE ───────────────────────────────────────────
// Opens or creates the IndexedDB database.
// Called internally — never call this directly from components.

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // keyPath is 'id' — each file has a unique string id
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
        });
        // Index by tool so each tool only sees its own files
        store.createIndex('tool', 'tool', { unique: false });
        // Index by updatedAt for sorting by recent
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    },
  });
}

// ─── SAVE FILE ───────────────────────────────────────────────
// Saves or updates a file in IndexedDB.
//
// Usage:
//   import { saveFile } from '@/lib/localStore';
//   await saveFile({
//     id: 'doc-123',          // unique string id
//     tool: 'write',          // which tool owns this file
//     name: 'My Document',    // display name
//     content: '...',         // file content — any format
//   });

export async function saveFile({ id, tool, name, content }) {
  const db = await getDB();
  const now = new Date().toISOString();

  await db.put(STORE_NAME, {
    id,
    tool,
    name,
    content,
    updatedAt: now,
    // createdAt only set on first save
    createdAt: (await db.get(STORE_NAME, id))?.createdAt ?? now,
  });
}

// ─── GET FILE ────────────────────────────────────────────────
// Retrieves a single file by id.
//
// Usage:
//   const file = await getFile('doc-123');
//   if (file) console.log(file.content);

export async function getFile(id) {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

// ─── LIST FILES ──────────────────────────────────────────────
// Returns all files belonging to a specific tool,
// sorted by most recently updated first.
//
// Usage:
//   const files = await listFiles('write');

export async function listFiles(tool) {
  const db = await getDB();
  const all = await db.getAllFromIndex(STORE_NAME, 'tool', tool);
  return all.sort((a, b) =>
    new Date(b.updatedAt) - new Date(a.updatedAt)
  );
}

// ─── DELETE FILE ─────────────────────────────────────────────
// Permanently deletes a file from IndexedDB.
//
// Usage:
//   await deleteFile('doc-123');

export async function deleteFile(id) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

// ─── GENERATE ID ─────────────────────────────────────────────
// Generates a unique file id.
// Call this when creating a new file.
//
// Usage:
//   const id = generateFileId('write');
//   → 'write-1718123456789-x7k2m'

export function generateFileId(tool) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 7);
  return `${tool}-${timestamp}-${random}`;
}

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial tool template
// REASON: Local-first file storage — no server, no cost,
//         works offline, user owns their files completely
//         idb chosen over raw IndexedDB API for cleaner syntax
