import logo from './logo.svg';
import './App.css';
import { Button, Input, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import ToDoItem from './Components/List';
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from './Backend/Config.js'

function App() {
  const db = getFirestore(app);
  const storage = getStorage(app); 

  const todoListRef = collection(db, "ToDoList");
  const [listItem, setListItem] = useState("");
  const [toDoList, setToDoList] = useState([]);
  const [FileForUpload, setFileForUpload] = useState(null);

  const fetchToDoList = async () => {
    try {
      const querySnapshot = await getDocs(todoListRef);
      const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setToDoList(data);
    } catch (error) {
      console.error('Error fetching items from Firestore:', error);
      alert('Error loading tasks. Please try again later.');
    }
  };
  
  useEffect(() => {
    fetchToDoList();
  });

  const AddToList = async () => {
    const params = {
      TaskID: Date.now(),
      TDItem: listItem,
      CompletionState: false,
    };
  
    try {
      const docRef = await addDoc(todoListRef, params);
      console.log('Item added to Firestore:', docRef.id);
      setListItem("");
    } catch (error) {
      console.error('Error adding item to Firestore:', error);
      alert('Error adding task. Please try again later.');
    }
  };

  const handleMarkCompleted = async (taskID) => {
    const matchingItem = toDoList.find((item) => item.TaskID === taskID);
    if (matchingItem) {
      console.log(matchingItem.id)
      const currentCompletionState = matchingItem.CompletionState;
      const docRef = doc(db, "ToDoList", matchingItem.id);
  
      try {
        await updateDoc(docRef, {
          CompletionState: !currentCompletionState
        });
        const updatedToDoList = toDoList.map((item) =>
          item.id === taskID ? { ...item, CompletionState: !item.CompletionState } : item
        );
        setToDoList(updatedToDoList);
      } catch (error) {
        console.error('Error updating item in Firestore:', error);
        alert('Error updating task. Please try again later.');
      }
    } else {
      console.log(matchingItem)
      console.error('Task not found in toDoList');
    }
  };
  
  const DeleteListItem = async (taskID) => {
    const matchingItem = toDoList.find((item) => item.TaskID === taskID);
    const docRef = doc(db, "ToDoList", matchingItem.id);
  
    try {
      await deleteDoc(docRef);
      console.log('Item deleted from Firestore:', taskID);
      const updatedToDoList = toDoList.filter((item) => item.id !== taskID);
      setToDoList(updatedToDoList);
    } catch (error) {
      console.error('Error deleting item from Firestore:', error);
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

    const storageRef = ref(storage, `ToDoList/${FileForUpload.name}`); // Reference with filename

  try {
    const uploadTask = await uploadBytes(storageRef, FileForUpload);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    console.log('File uploaded successfully:', downloadURL);
    alert('File uploaded successfully!');
    // You can use downloadURL for further processing or display
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('Error uploading file. Please try again later.');
  }

    /*const s3 = new AWS.S3();
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
    }*/
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