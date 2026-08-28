const mongoose = require("mongoose");

const Todo = require("../models/Todo");


// ========================================
// CHECK OBJECT ID
// ========================================

const isValidId = (id) => {

  return mongoose.Types.ObjectId.isValid(id);

};


// ========================================
// GET TODOS
// GET /api/todos
// ========================================

const getTodos = async (req, res) => {

  try {

    const todos =
      await Todo.find({
        user: req.user
      }).sort({
        completed: 1,
        createdAt: -1
      });


    return res.json({
      todos
    });

  } catch (error) {

    console.error(
      "Get todos error:",
      error
    );


    return res.status(500).json({
      message:
        "Unable to load todo list."
    });

  }

};


// ========================================
// CREATE TODO
// POST /api/todos
// ========================================

const createTodo = async (req, res) => {

  try {

    const { title, subject = "", priority = "Medium" } = req.body;


    if (!title || !title.trim()) {

      return res.status(400).json({
        message:
          "Todo title is required."
      });

    }


    const todo =
      await Todo.create({

        user: req.user,

        title:
          title.trim(),

        subject: subject.trim(),

        priority,

        completed: false

      });


    return res.status(201).json({

      message:
        "Todo created successfully.",

      todo

    });

  } catch (error) {

    console.error(
      "Create todo error:",
      error
    );


    return res.status(500).json({
      message:
        "Unable to create todo."
    });

  }

};


// ========================================
// UPDATE TODO
// PUT /api/todos/:id
// ========================================

const updateTodo = async (req, res) => {

  try {

    const {
      id
    } = req.params;


    const { title, subject = "", priority = "Medium" } = req.body;


    if (!isValidId(id)) {

      return res.status(400).json({
        message:
          "Invalid todo ID."
      });

    }


    if (!title || !title.trim()) {

      return res.status(400).json({
        message:
          "Todo title is required."
      });

    }


    const todo =
      await Todo.findOne({
        _id: id,
        user: req.user
      });


    if (!todo) {

      return res.status(404).json({
        message:
          "Todo not found."
      });

    }


    todo.title =
      title.trim();

    todo.subject = subject.trim();

    todo.priority = priority;


    await todo.save();


    return res.json({

      message:
        "Todo updated successfully.",

      todo

    });

  } catch (error) {

    console.error(
      "Update todo error:",
      error
    );


    return res.status(500).json({
      message:
        "Unable to update todo."
    });

  }

};


// ========================================
// DELETE TODO
// DELETE /api/todos/:id
// ========================================

const deleteTodo = async (req, res) => {

  try {

    const {
      id
    } = req.params;


    if (!isValidId(id)) {

      return res.status(400).json({
        message:
          "Invalid todo ID."
      });

    }


    const todo =
      await Todo.findOneAndDelete({

        _id: id,

        user: req.user

      });


    if (!todo) {

      return res.status(404).json({
        message:
          "Todo not found."
      });

    }


    return res.json({

      message:
        "Todo deleted successfully."

    });

  } catch (error) {

    console.error(
      "Delete todo error:",
      error
    );


    return res.status(500).json({
      message:
        "Unable to delete todo."
    });

  }

};


// ========================================
// TOGGLE TODO
// PATCH /api/todos/:id/toggle
// ========================================

const toggleTodo = async (req, res) => {

  try {

    const {
      id
    } = req.params;


    if (!isValidId(id)) {

      return res.status(400).json({
        message:
          "Invalid todo ID."
      });

    }


    const todo =
      await Todo.findOne({

        _id: id,

        user: req.user

      });


    if (!todo) {

      return res.status(404).json({
        message:
          "Todo not found."
      });

    }


    todo.completed =
      !todo.completed;


    await todo.save();


    return res.json({

      message:
        todo.completed
          ? "Todo completed."
          : "Todo marked incomplete.",

      todo

    });

  } catch (error) {

    console.error(
      "Toggle todo error:",
      error
    );


    return res.status(500).json({
      message:
        "Unable to update todo."
    });

  }

};


module.exports = {

  getTodos,

  createTodo,

  updateTodo,

  deleteTodo,

  toggleTodo

};
