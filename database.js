import * as SQLite from 'expo-sqlite';


export const getDb = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('hikes.db');
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS hikes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        date TEXT NOT NULL,
        parking TEXT NOT NULL,
        length REAL NOT NULL,
        difficulty TEXT NOT NULL,
        description TEXT,
        trailType TEXT,
        estimatedTime INTEGER
      )
    `);
    
    console.log("DB opened and table checked!");
    return db;
  } catch (error) {
    console.error("FATAL DB ERROR during initialization:", error);
    throw error; 
  }
};


export const addHike = async (db, hike) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO hikes (name, location, date, parking, length, difficulty, description, trailType, estimatedTime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [hike.name, hike.location, hike.date, hike.parking, hike.length, hike.difficulty, hike.description, hike.trailType, hike.estimatedTime]
    );
    console.log("Hike added successfully! ID:", result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error inserting hike:", error);
    throw error;
  }
};


export const updateHike = async (db, hike) => {
  if (!hike.id) {
    throw new Error("Cannot update hike: ID is missing.");
  }
  try {
    const result = await db.runAsync(
      `UPDATE hikes SET
        name = ?, 
        location = ?, 
        date = ?, 
        parking = ?, 
        length = ?, 
        difficulty = ?, 
        description = ?, 
        trailType = ?, 
        estimatedTime = ?
       WHERE id = ?`,
      [
        hike.name, 
        hike.location, 
        hike.date, 
        hike.parking, 
        hike.length, 
        hike.difficulty, 
        hike.description, 
        hike.trailType, 
        hike.estimatedTime,
        hike.id
      ]
    );
    console.log(`Hike updated! Rows affected: ${result.changes}`);
    return result.changes;
  } catch (error) {
    console.error("Error updating hike:", error);
    throw error;
  }
};


export const getAllHikes = async (db) => { 
  try {

    const allHikes = await db.getAllAsync(`SELECT * FROM hikes ORDER BY date DESC;`); 
    return allHikes; 
  } catch (error) {
    console.error('Error fetching hikes:', error);
    throw error; 
  }
};

export const deleteHike = async (db, id) => { 
  try {
    const result = await db.runAsync(`DELETE FROM hikes WHERE id = ?;`, [id]);
    console.log(`Hike deleted! Rows affected: ${result.changes}`);
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting hike:', error);
    throw error; 
  }
};

export const deleteAllHikes = async (db) => { 
  try {
    const result = await db.runAsync(`DELETE FROM hikes;`);
    console.log(`All hikes deleted! Total rows affected: ${result.changes}`);
    return result.changes;
  } catch (error) {
    console.error('Error deleting all hikes:', error);
    throw error; 
  }
};