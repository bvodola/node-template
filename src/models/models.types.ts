import { Schema } from 'mongoose'

export enum UserType {
  Customer = 'Customer',
  BusinessOwner = 'BusinessOwner',
}

export interface IUser {
  _id: Schema.Types.ObjectId
  email: string
  password: string
  token?: string
  type: UserType
}
