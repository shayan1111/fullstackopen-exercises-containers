import axios from "axios";

const baseUrl = "http://localhost:3000"

const getTodos = async () => {
  const response = await axios.get(`${baseUrl}/todos`)
  return response.data
}

const createTodos = async (todoToAdd) => {
  const response = await axios.post(`${baseUrl}/todos`, todoToAdd)
  return response.data
}

const deleteTodo = async (todoIdToDelete) => {
  await axios.delete(`${baseUrl}/todos/${todoIdToDelete}`)
}

const completeTodo = async (todoIdToComplete, todoObject) => {
  const response = await axios.put(`${baseUrl}/todos/${todoIdToComplete}`, todoObject)
  return response.data
}

export default { getTodos, createTodos, deleteTodo, completeTodo }