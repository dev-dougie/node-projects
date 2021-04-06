const express = require('express')
const authMiddleware = require('../middlewares/auth')
const Project = require('../models/Project')
const Task = require('../models/Task')

const router = express.Router()

router.use(authMiddleware)

router.get("/", async (req, res) => {
    try {
          //Using eager loading
          const projects = await Project.find().populate(['user', 'tasks']);

          return res.send(projects)
    } catch (error) {
        console.log(error)
        return res.status(400).send({error: 'Can not list projects'})
    }
})

router.get('/:projectId', async (req, res) => {
    try {
        //Using eager loading
        const projects = await Project.findById(req.params.projectId).populate(['user', 'tasks']);

        return res.send(projects)

  } catch (error) {
      console.log(error)
      return res.status(400).send({error: 'Can not list projects'})
  }
})

router.post("/", async (req, res) => {
    try {   
            const { title, description, tasks } = req.body

            const project = await Project.create({title, description, user: req.userId});

            await Promise.all(tasks.map(async task => {
               
                const projectTask = new Task({...task, project: project._id})

                await projectTask.save()

                project.tasks.push(projectTask)
            }))
            
            await project.save()

    } catch (error) {
        console.log(error)
        return res.status(400).send({error: "Can not save project"})
    }
})

router.put('/:projectId', async (req, res) => {
    try {
          const { title, description, tasks } = req.body;

          const project = await Project.findByIdAndUpdate(req.params.projectId, {
              title,
              description
          }, {new: true})

          project.tasks = []

          await Task.remove({project: project._id})

          await Promise.all(tasks.map(async task => {
              const projectTask = new Task({...task, project: project._id})

              await projectTask.save()
              project.tasks.push(projectTask)
          }))
    } catch (error) {
        console.log(error)
        return res.status(400).send({error: 'Error no updating project'})
    }
})

router.delete('/:projectId', async (req, res) => {
    try {
         const project = await Project.findByIdAndRemove(req.params.projectId);

         return res.send()

    } catch (error) {
        console.log(error)
        return res.status(400).send({error: 'Error to delete project'})
    }
})

module.exports = app => app.use('/projects', router)    