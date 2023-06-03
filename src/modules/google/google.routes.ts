import express, { Request, Response } from 'express'
import {
  getFormattedPlacesAutocompletePredictions,
  getFormattedPlaceById,
  getDistanceMatrix,
  getDistanceMatrixByPlaceId,
} from './google.controllers'

let router = express.Router()

router.get('/places/autocomplete', async (req: Request, res: Response) => {
  if (typeof req.query.input === 'undefined') return res.sendStatus(401)
  const data = await getFormattedPlacesAutocompletePredictions(
    String(req.query.input),
  )
  res.send(data)
})

router.get('/places/:place_id', async (req: Request, res: Response) => {
  const place = await getFormattedPlaceById(req.params.place_id)
  res.send(place)
})

router.get(
  '/places/distance/:origin/:destination',
  async (req: Request, res: Response) => {
    const distanceMatrix = await getDistanceMatrix(
      req.params.origin,
      req.params.destination,
    )
    res.send(distanceMatrix)
  },
)

router.get(
  '/places/distance/ids/:origin/:destination',
  async (req: Request, res: Response) => {
    const distanceMatrix = await getDistanceMatrixByPlaceId(
      req.params.origin,
      req.params.destination,
    )
    res.send(distanceMatrix)
  },
)

export default router
