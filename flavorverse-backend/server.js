const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const storage = multer.memoryStorage();

// Modify the multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only jpg/jpeg
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(new Error("Only JPG/JPEG files are allowed"), false);
    }
  },
});

const app = express();
const PORT = 5000;
const MONGO_URI = "mongodb://localhost:27017";
const DATABASE_NAME = "flavorverse";
const JWT_SECRET = "your-secret-key"; // In production, use environment variable

app.use(cors());
app.use(express.json());

const client = new MongoClient(MONGO_URI);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DATABASE_NAME);
    const recipesCollection = db.collection("recipes");
    const usersCollection = db.collection("users");

    // User registration
    app.post("/api/register", async (req, res) => {
      try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const result = await usersCollection.insertOne({
          username,
          email,
          password: hashedPassword,
          createdAt: new Date(),
        });

        res.status(201).json({ message: "User registered successfully" });
      } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // User login
    app.post("/api/login", async (req, res) => {
      try {
        const { email, password } = req.body;

        // Find user
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(400).json({ message: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          JWT_SECRET,
          { expiresIn: "24h" }
        );

        res.json({ token, userId: user._id });
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // Protected routes - Add authenticateToken middleware
    app.get("/api/recipes", async (req, res) => {
      try {
        const recipes = await recipesCollection.find({}).toArray();

        // Get all unique userIds from recipes
        const userIds = [...new Set(recipes.map((recipe) => recipe.userId))];

        // Get user information for all recipes
        const users = await usersCollection
          .find({ _id: { $in: userIds.map((id) => new ObjectId(id)) } })
          .toArray();

        // Create a map of userId to username
        const userMap = users.reduce((acc, user) => {
          acc[user._id.toString()] = user.username;
          return acc;
        }, {});

        // Add username to each recipe
        const recipesWithUsernames = recipes.map((recipe) => ({
          ...recipe,
          username: userMap[recipe.userId] || "Unknown User",
        }));

        res.json(recipesWithUsernames);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/api/recipes/:id", async (req, res) => {
      try {
        const recipe = await recipesCollection.findOne({
          _id: new ObjectId(req.params.id),
        });
        if (recipe) res.json(recipe);
        else res.status(404).send("Recipe not found");
      } catch (error) {
        console.error("Error fetching recipe by ID:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Protected routes that require authentication
    app.post(
      "/api/recipes",
      authenticateToken,
      upload.single("image"),
      async (req, res) => {
        try {
          if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError });
          }

          const newRecipe = {
            ...req.body,
            userId: req.user.userId,
            createdAt: new Date(),
            ingredients: JSON.parse(req.body.ingredients),
            image: req.file
              ? {
                  data: req.file.buffer.toString("base64"),
                  contentType: req.file.mimetype,
                }
              : null,
          };

          const result = await recipesCollection.insertOne(newRecipe);
          res.status(201).json(result);
        } catch (error) {
          console.error("Error creating new recipe:", error);
          res.status(500).send("Internal Server Error");
        }
      }
    );

    app.delete("/api/recipes/:id", authenticateToken, async (req, res) => {
      try {
        // Check if user owns the recipe
        const recipe = await recipesCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!recipe) {
          return res.status(404).send("Recipe not found");
        }

        if (recipe.userId !== req.user.userId) {
          return res
            .status(403)
            .json({ message: "Not authorized to delete this recipe" });
        }

        const result = await recipesCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });

        res.status(200).send("Recipe deleted");
      } catch (error) {
        console.error("Error deleting recipe:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Add this new endpoint for user-specific recipes
    app.get("/api/user/recipes", authenticateToken, async (req, res) => {
      try {
        const recipes = await recipesCollection
          .find({ userId: req.user.userId })
          .toArray();
        res.json(recipes);
      } catch (error) {
        console.error("Error fetching user recipes:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server error:", error);
  }
}

main().catch(console.error);
