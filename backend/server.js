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

app.use(cors(
  {
    origin: "https://ibm-internship-final-project-frontend-j6y0.onrender.com",
    credentials: true
  }
));

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


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});