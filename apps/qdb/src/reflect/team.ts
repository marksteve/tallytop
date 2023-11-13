import { generate } from '@rocicorp/rails'

export type Member = {
  name: string
  category: 'mens' | 'womens' | 'youth'
}

export type Team = {
  id: string
  name: string
  members: Member[]
}

export const {
  put: putTeam,
  get: getTeam,
  update: updateTeam,
  delete: deleteTeam,
  list: listTeams,
} = generate<Team>('team')
