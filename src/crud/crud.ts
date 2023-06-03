import express, { Router } from 'express'
import * as models from 'src/models/models'
import { CrudConfig, GenericMongooseModel } from './crud.types'
import * as crudUtils from './crud.utils'

export default function crudGenerator<T>(
  collectionName: keyof typeof models,
  config?: CrudConfig,
  router?: Router,
) {
  // ======
  // Config
  // ======
  if (!router) router = express.Router()
  const Model: GenericMongooseModel = models[collectionName]

  // ======
  // Create
  // ======
  router.post('/', async (req, res) => {
    try {
      const newEntry = req.body
      const newEntryRes = await Model.create(newEntry)
      res.send(newEntryRes).status(200)
    } catch (err) {
      console.log('CRUD create ERROR', err)
      res.status(500).send(err)
    }
  })

  // =======
  // Get One
  // =======
  router.get('/:id', async (req, res) => {
    try {
      let entryPromise = Model.findById(req.params.id)
      let { populate } = req.query

      if (typeof populate === 'string') {
        const parsedPopulate = populate.split(',')
        parsedPopulate.forEach((p) => {
          entryPromise = entryPromise.populate(p)
        })
      }

      const entry = await entryPromise
      if (!entry) return res.status(404).send({ message: 'Entry Not Found' })
      res.send(entry)
    } catch (err) {
      console.log('CRUD findById ERROR', err)
      const errorMessage =
        err && typeof err === 'object' && 'message' in err ? err?.message : ''

      res.status(500).send({
        error: true,
        message: errorMessage,
      })
    }
  })

  // ========
  // Get Many
  // ========
  router.get('/*', async (req, res) => {
    try {
      const { data, totalCount } = await crudUtils.getMany(
        Model,
        req.query,
        config?.textSearchParams,
      )
      res.header('Access-Control-Expose-Headers', 'X-Total-Count')
      res.set('X-Total-Count', String(totalCount))
      res.send(data)
    } catch (err) {
      console.log('CRUD findAll ERROR', err)
      res.status(500).send(err)
    }
  })

  // ======
  // Update
  // ======
  router.put('/:id', async (req, res) => {
    try {
      const updatedEntry = req.body
      const updatedEntryRes = await Model.updateOne(
        { id: req.params.id },
        updatedEntry,
      )

      res.send(updatedEntryRes).status(200)
    } catch (err) {
      console.log('CRUD update ERROR', err)
      res.status(500).send(err)
    }
  })

  // ======
  // Delete
  // ======
  router.delete('/:id', async (req, res) => {
    try {
      await Model.remove({ _id: req.params.id })
      res.sendStatus(204)
    } catch (err) {
      console.log('CRUD delete ERROR', err)
      res.status(500).send(err)
    }
  })

  // ===============
  // Get Many by IDs
  // ===============
  router.get('/by-ids', async (req, res) => {
    const ids = JSON.parse(JSON.stringify(req.query.ids))
    const data = await crudUtils.getMultipleEntriesById(Model, ids)
    res.send(data)
  })

  return router
}
