import sqlite3 from "sqlite3"; // Importă sqlite3
import { open } from "sqlite"; // Importă metoda open din sqlite

// Creează conexiunea la baza de date
export const openDatabase = async () => {
  const db = await open({
    filename: "./database/batsDatabase.db", // Calea către baza de date
    driver: sqlite3.Database, // Folosește sqlite3 ca driver
  });

  // Creează tabela dacă nu există
  await db.run(`
    CREATE TABLE IF NOT EXISTS colonies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      time TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      description TEXT NOT NULL
    );
  `);

  return db;
};
