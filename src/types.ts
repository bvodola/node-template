export interface User {
  id: number
  email: string
  password: string
  token?: string
}

export interface CreateUserDto {
  email: string
  password: string
  token?: string
}
