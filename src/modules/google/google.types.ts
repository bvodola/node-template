export type GooglePlace = {
  place_id: string
  geometry: {
    location: {
      lat: string
      lng: string
    }
  }
  formatted_address: string
  address_components: {
    types: GoogleAddressTypes[]
    long_name: string
  }[]
}

export type GooglePlacesAutocompletePrediction = {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export type DistanceMatrixRes = {
  status: string
  rows: {
    elements: any
  }[]
}

export enum GoogleAddressTypes {
  Route = 'route',
  StreetNumber = 'street_number',
  SublocalityLevel1 = 'sublocality_level_1',
  AdministrativeAreaLevel1 = 'administrative_area_level_1',
  AdministrativeAreaLevel2 = 'administrative_area_level_2',
  PostalCode = 'postal_code',
}

export enum LocalAddressTypes {
  Route = 'route',
  Number = 'number',
  Neighborhood = 'neighborhood',
  City = 'city',
  State = 'state',
  Zipcode = 'zipcode',
}

export type AddressTypesDict = {
  google: GoogleAddressTypes
  local: LocalAddressTypes
}

export type FormattedPlace = {
  place_id: string
  lat: string
  lng: string
  formatted_address: string
  route: string
  number: string
  neighborhood: string
  city: string
  state: string
  zipcode: string
}
