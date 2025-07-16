const con = require('../db/connection');

exports.addTask = (req, res) => {
  const { email, title, description, category, dueDate } = req.body;
  let image = req.body.image || null;  
  if (req.file) {
    image = `http://192.168.1.241:3000/uploads/${req.file.filename}`;  
  }

  if (!email || !title || !description || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO tasks (email, title, description, category, image, dueDate)
    VALUES (?, ?, ?, ?, ?,?)
  `;

  con.query(query, [email, title, description, category, image, dueDate], (err, result) => {
    if (err) {
      console.error('Error adding task:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({ message: 'Task added successfully', taskId: result.insertId });
  });
};


// Get all tasks for a user by email
exports.getTasksByEmail = (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const query = 'SELECT * FROM tasks WHERE email = ? ORDER BY created_at DESC';

  con.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json(results);
  });
};

// Delete a task
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  con.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.status(200).json({ message: 'Deleted successfully' });
  });
};
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, category, image, dueDate } = req.body;

  const sql = `
    UPDATE tasks SET title = ?, description = ?, category = ?, image = ?, dueDate = ? 
    WHERE id = ? 
  `;

  con.query(sql, [title, description, category, image, dueDate, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Update failed' });
    }

   
    res.status(200).json({ message: 'Updated successfully' });
  });
};

 exports.selectTask=(req,res)=>{
const { id } = req.params;
  const { select } = req.body;
    const sql = 'UPDATE tasks SET selecttask = ? WHERE id = ?';
    
  con.query(sql, [select, id], (err, result) => {
    if (err) {
      console.error('Error updating task status:', err);
      return res.status(500).json({ error: 'Failed to update task status' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task status updated successfully' });
  });

 }



exports.toggleTaskStatus = (req, res) => {
  const { id } = req.params;
  const { is_done } = req.body;

  const sql = 'UPDATE tasks SET is_done = ? WHERE id = ?';

  con.query(sql, [is_done, id], (err, result) => {
    if (err) {
      console.error('Error updating task status:', err);
      return res.status(500).json({ error: 'Failed to update task status' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task status updated successfully' });
  });
};
