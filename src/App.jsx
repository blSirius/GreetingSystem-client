import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  // const [todo, setTodo] = useState([]);
  const [no, setNo] = useState('');
  const [list, setList] = useState('');
  const [error, setEror] = useState('');

  // useEffect(() => {
  //   axios.get('http://localhost:5000/getTodo')
  //     .then(response => setTodo(response.data))
  //     .catch(error => console.error('Error:', error));
  // }, []);

  const handleAddTodo = async () => {
    try {
      const response = await axios.post('http://localhost:5000/addTodo', { no, list });
      console.log('Todo added:', response.data);
      // Optionally update the state or perform other actions after a successful addition
    } catch (error) {
      setEror('Error')
      console.error('Error adding todo:', error);
    }
    setList('');
    setNo('');
  };

  return (
    <div>
      {/* {todo.map(todos => (
        <div key={todos.no}>
          {todos.list}
        </div>
      ))} */}

      {error ? <span>{error}</span> : ''}
      <input type="text" placeholder="no" value={no} onChange={(e) => setNo(e.target.value)} />
      <input type="text" placeholder="list" value={list} onChange={(e) => setList(e.target.value)} />
      <button onClick={handleAddTodo}>Add Todo</button>

    </div>
  )
}
export default App