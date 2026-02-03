import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Database from 'better-sqlite3';

// Import Seeds
import { SEED_SHIPS, SEED_CHECKLISTS } from './seeds.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Setup Middleware
app.use(cors());
app.use(express.json());

// Setup Storage for Uploads
const uploadDir = path.join(__dirname, 'storage', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        // Sanitize filename
        const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${Date.now()}-${cleanName}`)
    }
});

const upload = multer({ storage: storage });

// Setup Database (SQLite)
const dbDir = path.join(__dirname, 'storage');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}
const dbPath = path.join(dbDir, 'fiordland.db');
const db = new Database(dbPath);

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS checklists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    data TEXT,
    synced INTEGER DEFAULT 1,
    pdf_url TEXT,
    email_sent INTEGER DEFAULT 0,
    archived INTEGER DEFAULT 0,
    archived_at DATETIME
  );
  
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    password_hash TEXT, -- Storing simple password for now
    avatar_url TEXT
  );

  CREATE TABLE IF NOT EXISTS app_config (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS ships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    cruise_line TEXT,
    imo TEXT,
    length TEXT,
    beam TEXT,
    gross_tonnage TEXT,
    draft TEXT
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    file_url TEXT,
    category TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// --- Seed Data Migration ---
try {
    // Seed Ships
    const shipCount = db.prepare('SELECT count(*) as count FROM ships').get().count;
    if (shipCount === 0) {
        console.log("Seeding Ships...");
        const insertShip = db.prepare(`
            INSERT INTO ships (name, cruise_line, imo, length, beam, gross_tonnage, draft)
            VALUES (@name, @cruiseLine, @imo, @length, @beam, @grossTonnage, @draft)
        `);
        const insertMany = db.transaction((ships) => {
            for (const ship of ships) insertShip.run(ship);
        });
        insertMany(SEED_SHIPS);
        console.log(`Seeded ${SEED_SHIPS.length} ships.`);
    }

    // Seed Config (Checklists)
    const checklistConfig = db.prepare('SELECT value FROM app_config WHERE key = ?').get('checklist_schema');
    if (!checklistConfig) {
        console.log("Seeding Checklists Schema...");
        db.prepare('INSERT INTO app_config (key, value) VALUES (?, ?)').run('checklist_schema', JSON.stringify(SEED_CHECKLISTS));
        // Also seed routes configuration
        const routesConfig = {
            reversed: ['Dusky to Breaksea', 'Doubtful to Thompson', 'Milford', 'Stewart Island'],
            normal: ['Milford', 'Thompson to Doubtful', 'Breaksea to Dusky', 'Stewart Island']
        };
        db.prepare('INSERT INTO app_config (key, value) VALUES (?, ?)').run('routes_config', JSON.stringify(routesConfig));
        console.log("Seeded Config.");
    }
} catch (error) {
    console.error("Seeding Failed:", error);
}

// --- API Routes ---

// Upload PDF
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // Return the URL to access this file
    // In production (Render), this URL must be relative to the domain
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// Serve Uploaded Files
app.use('/uploads', express.static(path.join(__dirname, 'storage', 'uploads')));

// Save Checklist
app.post('/api/checklists', (req, res) => {
    const { user_id, type, data, pdf_url, email_sent, archived } = req.body;

    try {
        const stmt = db.prepare(`
            INSERT INTO checklists (user_id, type, data, pdf_url, email_sent, archived, created_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        `);
        const info = stmt.run(user_id, type, JSON.stringify(data), pdf_url, email_sent ? 1 : 0, archived ? 1 : 0);
        res.json({ id: info.lastInsertRowid });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save checklist' });
    }
});

// Update Checklist
app.put('/api/checklists/:id', (req, res) => {
    const { id } = req.params;
    const { data, pdf_url, email_sent, archived, archived_at } = req.body;

    // Dynamic update builder
    const updates = [];
    const values = [];

    if (data !== undefined) { updates.push('data = ?'); values.push(JSON.stringify(data)); }
    if (pdf_url !== undefined) { updates.push('pdf_url = ?'); values.push(pdf_url); }
    if (email_sent !== undefined) { updates.push('email_sent = ?'); values.push(email_sent ? 1 : 0); }
    if (archived !== undefined) { updates.push('archived = ?'); values.push(archived ? 1 : 0); }
    if (archived_at !== undefined) { updates.push('archived_at = ?'); values.push(archived_at); }

    if (updates.length === 0) return res.json({ success: true });

    values.push(id);

    try {
        const stmt = db.prepare(`UPDATE checklists SET ${updates.join(', ')} WHERE id = ?`);
        stmt.run(...values);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update checklist' });
    }
});

// Get Single Checklist
app.get('/api/checklists/:id', (req, res) => {
    const { id } = req.params;
    try {
        const row = db.prepare('SELECT * FROM checklists WHERE id = ?').get(id);
        if (!row) {
            return res.status(404).json({ error: 'Checklist not found' });
        }
        const result = {
            ...row,
            data: JSON.parse(row.data),
            synced: true,
            emailSent: !!row.email_sent,
            archived: !!row.archived,
            pdfUrl: row.pdf_url,
            userId: row.user_id,
            createdAt: new Date(row.created_at)
        };
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch checklist' });
    }
});

// Get Checklists collection
app.get('/api/checklists', (req, res) => {
    const { user_id, type } = req.query;
    try {
        let stmt;
        let rows;

        // Check if requesting user is Admin
        const user = db.prepare('SELECT email FROM users WHERE id = ?').get(user_id);
        const isAdmin = user && user.email === 'fiordlandpilotage@gmail.com';

        if (type === 'entry_exit') {
            // For Logbook: Fetch ALL records of type 'entry_exit', ignoring user_id
            stmt = db.prepare('SELECT * FROM checklists WHERE type = ? ORDER BY created_at DESC');
            rows = stmt.all('entry_exit');
        } else {
            if (isAdmin) {
                // Admin: Fetch ALL checklists from ALL users
                stmt = db.prepare('SELECT * FROM checklists WHERE type != ? ORDER BY created_at DESC');
                rows = stmt.all('entry_exit');
            } else {
                // Regular User: Fetch only THEIR records
                stmt = db.prepare('SELECT * FROM checklists WHERE user_id = ? AND type != ? ORDER BY created_at DESC');
                rows = stmt.all(user_id, 'entry_exit');
            }
        }

        const results = rows.map(row => ({
            ...row,
            data: JSON.parse(row.data),
            synced: true,
            emailSent: !!row.email_sent,
            archived: !!row.archived,
            pdfUrl: row.pdf_url,
            userId: row.user_id,
            createdAt: new Date(row.created_at)
        }));
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch checklists' });
    }
});

const ADMIN_EMAIL = 'fiordlandpilotage@gmail.com';

app.delete('/api/checklists/:id', (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    try {
        const user = db.prepare('SELECT email FROM users WHERE id = ?').get(user_id);
        if (!user || user.email !== ADMIN_EMAIL) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        db.prepare('DELETE FROM checklists WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Delete failed' });
    }
});

// Auth (Simple)
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    // For this pilot app, we'll auto-create users if they don't exist for simplicity,
    // or just check against a hardcoded list/DB.

    // Check if user exists
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
        // Create new user (Demo Mode: Password is just saved plain or simple hash)
        // In real app: Hash password with bcrypt
        const id = Math.random().toString(36).substring(7);
        db.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)').run(id, email, password);
        user = { id, email, full_name: email.split('@')[0] };
    } else {
        // Verify password (Simple check)
        if (user.password_hash !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    }

    res.json({ user: { id: user.id, email: user.email, full_name: user.full_name, avatar_url: user.avatar_url } });
});


// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

// --- Admin Panel API Routes ---

// Config API
app.get('/api/config/:key', (req, res) => {
    try {
        const row = db.prepare('SELECT value FROM app_config WHERE key = ?').get(req.params.key);
        if (row) res.json(JSON.parse(row.value));
        else res.status(404).json({ error: 'Key not found' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/config', (req, res) => {
    const { key, value } = req.body;
    try {
        db.prepare('INSERT OR REPLACE INTO app_config (key, value) VALUES (?, ?)').run(key, JSON.stringify(value));
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Ships API
app.get('/api/ships', (req, res) => {
    try {
        const ships = db.prepare('SELECT * FROM ships ORDER BY name ASC').all();
        res.json(ships);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/ships', (req, res) => {
    const { name, cruise_line, imo, length, beam, gross_tonnage, draft } = req.body;
    try {
        const stmt = db.prepare(`
            INSERT INTO ships (name, cruise_line, imo, length, beam, gross_tonnage, draft)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const info = stmt.run(name, cruise_line, imo, length, beam, gross_tonnage, draft);
        res.json({ id: info.lastInsertRowid });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/ships/:id', (req, res) => {
    const { id } = req.params;
    const { name, cruise_line, imo, length, beam, gross_tonnage, draft } = req.body;
    try {
        const stmt = db.prepare(`
            UPDATE ships SET name=?, cruise_line=?, imo=?, length=?, beam=?, gross_tonnage=?, draft=?
            WHERE id=?
        `);
        stmt.run(name, cruise_line, imo, length, beam, gross_tonnage, draft, id);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/ships/:id', (req, res) => {
    try {
        db.prepare('DELETE FROM ships WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Documents API
app.get('/api/documents', (req, res) => {
    try {
        const docs = db.prepare('SELECT * FROM documents ORDER BY uploaded_at DESC').all();
        res.json(docs);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/documents', (req, res) => {
    const { title, file_url, category } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO documents (title, file_url, category) VALUES (?, ?, ?)');
        const info = stmt.run(title, file_url, category);
        res.json({ id: info.lastInsertRowid });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/documents/:id', (req, res) => {
    try {
        db.prepare('DELETE FROM documents WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Storage path: ${uploadDir}`);
    console.log(`Database path: ${dbPath}`);
});
