const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json({ limit: "5mb" }));


// ========================================
// AUTH
// ========================================

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);


// ========================================
// SUBJECTS
// ========================================

app.use(
  "/api/subjects",
  require("./routes/subjectRoutes")
);


// ========================================
// SCHEDULES
// ========================================

app.use(
  "/api/schedules",
  require("./routes/scheduleRoutes")
);

// ========================================
// ASSIGNMENTS
// ========================================

app.use(
  "/api/assignments",
  require("./routes/assignmentRoutes")
);


app.use(
  "/api/todos",
  require("./routes/todoRoutes")
);


// EXAMS

app.use(
  "/api/exams",
  require("./routes/examRoutes")
);

// ========================================
// TEST
// ========================================

app.get("/", (req, res) => {

  res.json({
    message:
      "Study Planner API is running"
  });

});


const PORT =
  process.env.PORT || 5000;


app.listen(
  PORT,
  () => {

    console.log(
      `Server running on http://localhost:${PORT}`
    );

  }
);