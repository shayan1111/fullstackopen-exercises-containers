import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const updatedLikes = async newObject => {
  const { id, user, ...rest } = newObject
  const updatedBlog = {
    ...rest,
    likes: newObject.likes + 1
  }

  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  return response.data
}

const deleteBlog = async idToDelete => {
  const config = {
    headers: { Authorization: token }
  }
  await axios.delete(`${baseUrl}/${idToDelete}`, config)
  return
}

export default { getAll, create, setToken, updatedLikes, deleteBlog }