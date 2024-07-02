import React from 'react';
import { Button, Typography } from '@mui/material';

const ToDoItem = ({ text, CompletionState, markCompleted, DeleteItem }) => {
  return (
    <div className="todo-item">
      <Typography variant="body1">{text}</Typography>
      <div>
        <Button
          variant="contained"
          color={CompletionState ? 'secondary' : 'primary'} // Adjust color based on state
          onClick={markCompleted}
          style={{ margin: '5px' }}
        >
          {CompletionState ? 'Mark Incomplete' : 'Mark Complete'}
        </Button>
        <Button variant="contained" color="secondary" onClick={DeleteItem} >
          Delete
        </Button>
        {/* Add an Edit button if needed */}
      </div>
    </div>
  );
};

export default ToDoItem;
