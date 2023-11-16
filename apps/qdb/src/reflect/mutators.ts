import { putAttempts } from './attempts'
import { createTeam, deleteTeam, listTeams, updateTeam } from './team'

export const mutators = {
  createTeam,
  listTeams,
  updateTeam,
  deleteTeam,
  putAttempts,
}

export type M = typeof mutators
