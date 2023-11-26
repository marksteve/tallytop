import {
  createCompetitor,
  deleteCompetitor,
  listCompetitors,
  updateCompetitor,
} from './competitor'
import { promoteCompetitors, putAttempts } from './score'
import { createTeam, deleteTeam, listTeams, updateTeam } from './team'

export const mutators = {
  // teams
  createTeam,
  listTeams,
  updateTeam,
  deleteTeam,
  // competitor
  createCompetitor,
  listCompetitors,
  updateCompetitor,
  deleteCompetitor,
  // score
  putAttempts,
  promoteCompetitors,
}

export type M = typeof mutators
