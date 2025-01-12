import express from "express";
import { openDatabase } from "./database/database.js";

const app = express();
const port = 3000;

app.use(express.json());

let db;

openDatabase()
  .then((database) => {
    db = database;
    console.log("Connected to SQLite database");
  })
  .catch((error) => {
    console.error("Failed to connect to the database", error);
  });

app.get("/colonies", async (req, res) => {
  try {
    const colonies = await db.all("SELECT * FROM colonies");
    res.json(colonies);
  } catch (error) {
    res.status(500).send("Error fetching colonies: " + error.message);
  }
});

app.post("/add-colony", async (req, res) => {
  const { time, latitude, longitude, description } = req.body;

  try {
    const result = await db.run(
      "INSERT INTO colonies (time, latitude, longitude, description) VALUES (?, ?, ?, ?)",
      [time, latitude, longitude, description]
    );
    console.log("Colony added with ID:", result.lastID); // Log ID-ul coloniei adăugate
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    console.error("Error adding colony:", error);
    res.status(500).send("Error adding colony: " + error.message);
  }
});

// Edit a colony description
app.put("/edit-colony/:id", async (req, res) => {
  const { id } = req.params; // The colony ID
  const { description } = req.body; // New description

  try {
    const result = await db.run(
      "UPDATE colonies SET description = ? WHERE id = ?",
      [description, id]
    );

    if (result.changes > 0) {
      res.status(200).json({ message: "Colony updated successfully" });
      console.log("Colony with ID edited:", id); // Log ID-ul coloniei adăugate
    } else {
      res.status(404).send("Colony not found");
    }
  } catch (error) {
    console.error("Error updating colony:", error);
    res.status(500).send("Error updating colony: " + error.message);
  }
});

// Delete a colony
app.delete("/delete-colony/:id", async (req, res) => {
  const { id } = req.params; // The colony ID to delete

  try {
    const result = await db.run("DELETE FROM colonies WHERE id = ?", [id]);

    if (result.changes > 0) {
      res.status(200).json({ message: "Colony deleted successfully" });
      console.log("Colony with ID deleted:", id); // Log ID-ul coloniei adăugate
    } else {
      res.status(404).send("Colony not found");
    }
  } catch (error) {
    console.error("Error deleting colony:", error);
    res.status(500).send("Error deleting colony: " + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
