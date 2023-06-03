import {
  AddressTypesDict,
  FormattedPlace,
  GoogleAddressTypes,
  GooglePlace,
  LocalAddressTypes,
} from './google.types'

/**
 * Dictionary between google places and
 * local object property names
 */
const ADDRESS_TYPES_DICT: AddressTypesDict[] = [
  { google: GoogleAddressTypes.Route, local: LocalAddressTypes.Route },
  {
    google: GoogleAddressTypes.StreetNumber,
    local: LocalAddressTypes.Number,
  },
  {
    google: GoogleAddressTypes.SublocalityLevel1,
    local: LocalAddressTypes.Neighborhood,
  },
  {
    google: GoogleAddressTypes.AdministrativeAreaLevel2,
    local: LocalAddressTypes.City,
  },
  {
    google: GoogleAddressTypes.AdministrativeAreaLevel1,
    local: LocalAddressTypes.State,
  },
  { google: GoogleAddressTypes.PostalCode, local: LocalAddressTypes.Zipcode },
]

/**
 * Converts google place object into object
 * that is formatted based on local convention
 */
export function getFormattedPlaceObject(place: GooglePlace) {
  const formattedPlace: Partial<FormattedPlace> = {
    place_id: place.place_id,
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    formatted_address: place.formatted_address,
  }

  place.address_components.forEach((entry) => {
    ADDRESS_TYPES_DICT.forEach((type) => {
      if (entry.types.indexOf(type.google) >= 0) {
        formattedPlace[type.local] = entry.long_name
      }
    })
  })

  return formattedPlace
}
