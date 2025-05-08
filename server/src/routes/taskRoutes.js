const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.get("/check-duplicate", taskController.checkDuplicateTitle);
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/", taskController.deleteAllTasks);
router.delete("/:id", taskController.deleteTaskById);

module.exports = router;
