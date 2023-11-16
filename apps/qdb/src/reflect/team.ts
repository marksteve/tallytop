import { generate } from '@rocicorp/rails'
import type { WriteTransaction } from '@rocicorp/reflect'

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

export const createTeam = async (
  tx: WriteTransaction,
  team: Omit<Team, 'number'>,
) => {
  const number = (await listTeams(tx)).length + 1
  await putTeam(tx, { ...team, number })
}
