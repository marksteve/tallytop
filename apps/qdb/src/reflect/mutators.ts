import { listTeams, putTeam, deleteTeam } from './team'

export const mutators = {
  putTeam,
  deleteTeam,
  listTeams,
  init: async () => {},
}

export type M = typeof mutators
