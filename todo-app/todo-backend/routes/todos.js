const express = require('express');
const redis = require('../redis')
const { Todo } = require('../mongo')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

// GET statistics
router.get("/statistics", async (req, res) => {
  const todosLength = await redis.get("added_todos")
  res.send({ added_todos: todosLength ? Number(todosLength) : 0 })
})

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  
  let currentTodo = await redis.get("added_todos")

  let newTodoNumber = currentTodo ? Number(currentTodo) + 1 : 1

  await redis.set("added_todos", newTodoNumber)

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.status(200).send(req.todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body
  req.todo.text = text
  req.todo.done = done

  const updatedToDo = await req.todo.save()

  res.status(200).send(updatedToDo)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
