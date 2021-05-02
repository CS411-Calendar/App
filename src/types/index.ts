export type Invite = {
  id: number
  ownerId: string
  name: string
  createdAt: Date
  start: Date
  end: Date
  location: string
  to: string
}

export type User = {
  id: string
  createdAt: Date
}
