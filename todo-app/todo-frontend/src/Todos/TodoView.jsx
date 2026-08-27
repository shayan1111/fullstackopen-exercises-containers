import { useEffect, useState } from "react";
import todoService from "../services/todos";

import List from "./List";
import Form from "./Form";

const TodoView = () => {
  const [todos, setTodos] = useState([]);

  useEffect( () => {
    const loadTodos = async () => {
      const data = await todoService.getTodos();
      setTodos(data);
    };

    loadTodos();
  }, []);

  const createTodo = async (todo) => {
    const data = await todoService.createTodos(todo);
    setTodos([...todos, data]);
  };

  const deleteTodo = async (todo) => {
    await todoService.deleteTodo(todo._id);
    setTodos(todos.filter((t) => t._id !== todo._id));
  };

  const completeTodo = async (todo) => {
    const todoCompletedObject = {
      ...todo,
      done: true,
    };

    const newCompletedTodo = await todoService.completeTodo(
      todoCompletedObject._id,
      todoCompletedObject,
    );
    setTodos(
      todos.map((t) => (t._id === newCompletedTodo._id ? newCompletedTodo : t)),
    );
  };

  return (
    <>
      <h1>Todos</h1>
      <Form createTodo={createTodo} />
      <List todos={todos} deleteTodo={deleteTodo} completeTodo={completeTodo} />
    </>
  );
};

export default TodoView;
