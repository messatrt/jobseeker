const express = require("express");
const cors = require("cors");
const axios = require("axios");

const db = require("better-sqlite3")("database.db");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.get("/jobs", async (req, res) => {
  const searchTerm = req.query.q || "";
  const location = req.query.location || "india";
  const index = parseInt(req.query.index) || 0;
  const {
    experience,
    salary,
    type,
    company,
    industry,
    skills,
    education,
    jobLevel,
    benefits,
  } = req.query;

  const options = {
    method: "GET",
    url: "https://jobs-api14.p.rapidapi.com/list",
    params: {
      query: searchTerm,
      location: location,
      distance: "1.0",
      language: "en_GB",
      remoteOnly: "false",
      datePosted: "month",
      employmentTypes: type || "fulltime;parttime;intern;contractor",
      index: index.toString(),
      // Add other filter parameters
      experienceLevel: experience || "",
      salary: salary || "",
      company: company || "",
      industry: industry || "",
      skills: skills || "",
      educationLevel: education || "",
      jobLevel: jobLevel || "",
      benefits: benefits || "",
    },
    headers: {
      "x-rapidapi-host": "jobs-api14.p.rapidapi.com",
      "x-rapidapi-key": "2fbf86be5bmsh07b82da7ed0572bp16d336jsn59413d6cc2c1",
    },
  };

  try {
    console.log(`Searching for: ${searchTerm} in ${location}, Index: ${index}`);
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching jobs: ${error.message}`);
    res.status(500).json({ error: "Error fetching jobs from external API" });
  }
});
app.get("/getjobs", (req, res) => {
  try {
    const jobs = db.prepare("SELECT * FROM jobs").all();
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Error fetching jobs from the database" });
  }
});

// Add a new job
app.post("/jobs", (req, res) => {
  const { title, experience, salary, company, location, description } =
    req.body;
  try {
    const stmt = db.prepare(
      "INSERT INTO jobs (title, experience, salary, company, location, description) VALUES (?, ?, ?, ?, ?, ?)",
    );
    stmt.run(title, experience, salary, company, location, description);
    res.status(201).json({ message: "Job added successfully" });
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({ error: "Failed to add job" });
  }
});

// Delete a job by ID
app.delete("/job/:id", (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare("DELETE FROM jobs WHERE id = ?");
    stmt.run(id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ error: "Failed to delete job" });
  }
});

// Fetch all users
app.get("/users", (req, res) => {
  try {
    const users = db.prepare("SELECT * FROM users").all();
    users.forEach((user) => delete user.password); // Remove password before sending data
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users from the database" });
  }
});

// Delete a user by ID
app.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    stmt.run(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});
app.post("/signup", async (req, res) => {
  const { username, name, email, password } = req.body;

  try {
    // Hash the password before storing

    const stmt = db.prepare(
      "INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)",
    );
    stmt.run(username, name, email, password);

    res.status(201).send("User created");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});
app.post("/login", async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = db
      .prepare("SELECT * FROM users WHERE email = ? OR username = ?")
      .get(emailOrUsername, emailOrUsername);

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid email/username or password" });
    }

    if (user.password !== password) {
      return res
        .status(400)
        .json({ error: "Invalid email/username or password" });
    }

    // Return user data, including whether they are an admin
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/user/:id", (req, res) => {
  const { id } = req.params;
  const { education, experience, location, expertise, contact } = req.body;
  
  try {
    // First, get the current user data
    const currentUser = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check if any data has actually changed
    const hasChanges = 
      education !== currentUser.education ||
      experience !== currentUser.experience ||
      location !== currentUser.location ||
      expertise !== currentUser.expertise ||
      contact !== currentUser.contact;
    
    if (!hasChanges) {
      return res.status(200).json({ message: "No changes detected" });
    }
    
    // If there are changes, update the user
    const stmt = db.prepare(`
      UPDATE users
      SET education = ?, experience = ?, location = ?, expertise = ?, contact = ?
      WHERE id = ?
    `);
    const result = stmt.run(education, experience, location, expertise, contact, id);
    
    if (result.changes > 0) {
      res.status(200).json({ message: "Profile updated successfully" });
    } else {
      res.status(400).json({ error: "Failed to update profile" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  try {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    if (user) {
      delete user.password; // Don't send the password to the client
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
