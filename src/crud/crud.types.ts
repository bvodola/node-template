import { Model as MongooseModel } from 'mongoose'
import * as models from 'src/models/models'

export type GenericMongooseModel = MongooseModel<any, {}, {}, {}, any>

export type CrudConfig = {
  textSearchParams?: (string | OrQueryParam)[]
}

export type OrQueryParam = {
  model: keyof typeof models
  index: string
  fields: string[]
}
