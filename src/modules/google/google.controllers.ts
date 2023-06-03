import axios from 'axios'
import {
  DistanceMatrixRes,
  GooglePlacesAutocompletePrediction,
} from './google.types'
import * as googleHelpers from './google.helpers'

const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY

/**
 * Returns array of possible Google Places API results based on input
 * @param {string} input address text to be searched on Google Places API
 * @returns {array} of possible results based on input
 */
export async function getPlacesAutocomplete(input: string) {
  try {
    input = encodeURIComponent(input)
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_MAPS_KEY}&language=pt`,
    )
    return res.data
  } catch (err: any) {
    console.error(err)
    return err.response.data
  }
}

/**
 * Returns array of possible Google Places API results (formattedAddres prop only) based on input
 * @param {string} input address text to be searched on Google Places API
 * @returns {array} of formattedAddress strings
 */
export async function getFormattedPlacesAutocompletePredictions(input: string) {
  const data = await getPlacesAutocomplete(input)
  return data.predictions.map((p: GooglePlacesAutocompletePrediction) => ({
    placeId: p.place_id,
    formattedAddress: p.description,
    mainText: p.structured_formatting.main_text,
    secondaryText: p.structured_formatting.secondary_text,
  }))
}

/**
 * Fetches a place from Google Places API based on the place_api
 * @param {string} place_id taken from google
 * @returns {object} the object containing data from the fetched place
 */
export async function getPlaceById(place_id: string) {
  try {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=${GOOGLE_MAPS_KEY}`,
    )
    if (Array.isArray(res.data.results) && res.data.results.length >= 1) {
      return res.data.results[0]
    }
    return {}
  } catch (err: any) {
    console.error(err)
    return err.response.data
  }
}

/**
 * Fetches a place from Google Places API based on the place_api and gives its lat/lng
 * @param {string} place_id taken from google
 * @returns {object} the object containing lat/lng values
 */
export async function getFormattedPlaceById(place_id: string) {
  try {
    const place = await getPlaceById(place_id)
    const formattedPlace = googleHelpers.getFormattedPlaceObject(place)
    return formattedPlace
  } catch (err: any) {
    console.error(err)
    return err.response.data
  }
}

/**
 * Calculates distance and duration of trip from place_ids
 * @param {string} origins the origin place_id
 * @param {string} destinations the destination place_id
 * @returns distance matrix object with distance and duration
 */
export async function getDistanceMatrixByPlaceId(
  origins: string,
  destinations: string,
) {
  try {
    const distanceMatrix = await getDistanceMatrix(
      `place_id:${origins}`,
      `place_id:${destinations}`,
    )
    return distanceMatrix
  } catch (err: any) {
    console.error(err)
    return err.response.data
  }
}

/**
 * Calculates distance and duration of trip
 * @param {string} origins the origin address, lat/lng or place_id
 * @param {string} destinations the destination address, lat/lng or place_id
 * @returns distance matrix object with distance and duration
 */
export async function getDistanceMatrix(origins: string, destinations: string) {
  try {
    const res = await axios.get<DistanceMatrixRes>(
      `https://maps.googleapis.com/maps/api/distancematrix/json?&origins=${origins}&destinations=${destinations}&key=${GOOGLE_MAPS_KEY}&language=pt`,
    )
    if (res.data.status === 'OK') {
      return res.data.rows.map((row) => row.elements)
    }
    return {
      status: 'ERROR',
    }
  } catch (err) {
    console.error(err)
    return err
  }
}
