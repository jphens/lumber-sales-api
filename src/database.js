const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const dbPath = path.join(dataDir, 'lumber-sales.db');
const db = new Database(dbPath, { verbose: console.log });

// Create tables if they don't exist
const initDb = () => {
  // Create tickets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      customerName TEXT NOT NULL,
      customerPhone TEXT,
      date TEXT NOT NULL,
      total REAL NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create ticket_items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ticket_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticketId TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      width REAL NOT NULL,
      height REAL NOT NULL,
      length REAL NOT NULL,
      pricePerBF REAL NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (ticketId) REFERENCES tickets (id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized successfully');
};

// Initialize the database
initDb();

// Export the database instance
module.exports = db;