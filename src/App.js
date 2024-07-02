import logo from './logo.svg';
import './App.css';
import { Button, Input, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import ToDoItem from './Components/List';
import configureAWS from './Backend/Config';
import AWS from 'aws-sdk';

function App() {
  configureAWS();
  const [listItem, setListItem] = useState("");
  const [toDoList, setToDoList] = useState([]);
  const [FileForUpload, setFileForUpload] = useState(null);

  const fetchToDoList = async () => {
    const params = {
      TableName: 'ToDoList',
    };
    try {
      const data = await new AWS.DynamoDB.DocumentClient().scan(params).promise();
      setToDoList(data.Items);
    } catch (error) {
      console.error('Error fetching items from DynamoDB:', error);
      alert('Error loading tasks. Please try again later.');
    }
  };
  
  useEffect(() => {
    fetchToDoList();
  }, []);

  const AddToList = async () => {
    const params = {
      TableName: 'ToDoList',
      Item: {
        TaskID: Date.now(),
        TDItem: listItem,
        CompletionState: false,
      },
    };    
  
    try {
      const data = await new AWS.DynamoDB.DocumentClient().put(params).promise();
      console.log('Item added to DynamoDB:', data);
      setListItem("");
    } catch (error) {
      console.error('Error adding item to DynamoDB:', error);
      alert('Error adding task. Please try again later.');
    }
  };

  const handleMarkCompleted = async (taskID) => {
    const matchingItem = toDoList.find((item) => item.TaskID === taskID);
      if (matchingItem) {
        const currentCompletionState = matchingItem.CompletionState;
        const params = {
          TableName: 'ToDoList',
          Key: {
            TaskID: taskID, // Convert taskID to string for DynamoDB
          },
          UpdateExpression: 'SET CompletionState = :newCompletionState',
          ExpressionAttributeValues: {
            ':newCompletionState': !currentCompletionState,
          },
        };
        
      
        try {
          const data = await new AWS.DynamoDB.DocumentClient().update(params).promise();
          console.log('Item updated in DynamoDB:', data);
          const updatedToDoList = toDoList.map((item) =>
            item.TaskID === taskID ? { ...item, CompletionState: !item.CompletionState } : item
          );
          setToDoList(updatedToDoList);
        } catch (error) {
          console.error('Error updating item in DynamoDB:', error);
          alert('Error updating task. Please try again later.');
        }
      } else {
        console.error('Task not found in toDoList');
      }
  };

  const DeleteListItem = async (taskID) => {
    try {
      // 1. Delete from DynamoDB:
      const params = {
        TableName: 'ToDoList',
        Key: {
          TaskID: taskID,
        },
      };
  
      await new AWS.DynamoDB.DocumentClient().delete(params).promise();
      console.log('Item deleted from DynamoDB:', taskID);
  
      // 2. Update Local State:
      const updatedToDoList = toDoList.filter((item) => item.TaskID !== taskID);
      setToDoList(updatedToDoList);
    } catch (error) {
      console.error('Error deleting item from DynamoDB:', error);
      alert('Error deleting task. Please try again later.');
    }
  };

  const handleFileChange = (event) => {
    setFileForUpload(event.target.files[0]);
  };

  const UploadDocument = async () => {
    if (!FileForUpload) {
      alert("Please select a file to upload");
      return;
    }

    const s3 = new AWS.S3();
    const params = {
      Bucket: 'ToDoList', // Replace with your S3 bucket name
      Key: FileForUpload.name,
      Body: FileForUpload,
      ContentType: FileForUpload.type,
    };

    try {
      const data = await s3.upload(params).promise();
      console.log('File uploaded successfully:', data);
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again later.');
    }
  }

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <h1>To Do List</h1>
      <div className="ToDoItems">
      <TextField label="Add To List" onChange={(e) => setListItem(e.target.value)} />
      <Button onClick={AddToList}>Add</Button>
        {toDoList.length === 0 ? (
          <p>No to-do items yet. Add some tasks!</p>
        ) : (
          toDoList.map((item) => (
            <ToDoItem
              key={item.TaskID}
              text={item.TDItem}
              CompletionState={item.CompletionState}
              markCompleted={() => handleMarkCompleted(item.TaskID)}
              DeleteItem={() => DeleteListItem(item.TaskID)}
            />
          ))
        )}
      </div>
      <Input type='file' onChange={handleFileChange}/>
      <Button variant="contained" color="primary" onClick={UploadDocument}>Upload Document</Button>
    </div>
  );
}

export default App;
