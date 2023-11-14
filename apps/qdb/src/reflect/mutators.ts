import type { WriteTransaction } from '@rocicorp/reflect'
import { deleteTeam, listTeams, putTeam, updateTeam, type Team } from './team'

const createTeam = async (tx: WriteTransaction, team: Omit<Team, 'order'>) => {
  const order = (await listTeams(tx)).length + 1
  await putTeam(tx, { ...team, order })
}

export const mutators = {
  createTeam,
  listTeams,
  updateTeam,
  deleteTeam,
}

export type M = typeof mutators
