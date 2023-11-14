import type { WriteTransaction } from '@rocicorp/reflect'
import { deleteTeam, listTeams, putTeam, updateTeam, type Team } from './team'

const createTeam = async (tx: WriteTransaction, team: Omit<Team, 'number'>) => {
  const number = (await listTeams(tx)).length + 1
  await putTeam(tx, { ...team, number })
}

export const mutators = {
  createTeam,
  listTeams,
  updateTeam,
  deleteTeam,
}

export type M = typeof mutators
