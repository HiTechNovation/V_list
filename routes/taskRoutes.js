const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/tasks', taskController.addTask);
router.get('/tasks', taskController.getTasksByEmail);
router.delete('/tasks/:id', taskController.deleteTask);
router.put('/tasks/:id', taskController.updateTask);
router.patch('/tasks/:id', taskController.toggleTaskStatus); 
router.patch('/tasks/:id/select', taskController.selectTask);


module.exports = router;
