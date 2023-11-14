import { generate } from '@rocicorp/rails'

export type Member = {
  id: string
  name: string
  category: 'mens' | 'womens' | 'youth'
}

export type Team = {
  id: string
  name: string
  members: Member[]
  number: number
}

export const {
  put: putTeam,
  get: getTeam,
  update: updateTeam,
  delete: deleteTeam,
  list: listTeams,
} = generate<Team>('team')
