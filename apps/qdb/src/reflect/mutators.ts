import { putAttempts } from './attempts'
import {
  createCompetitor,
  deleteCompetitor,
  listCompetitors,
  updateCompetitor,
} from './competitor'
import { createTeam, deleteTeam, listTeams, updateTeam } from './team'

export const mutators = {
  // teams
  createTeam,
  listTeams,
  updateTeam,
  deleteTeam,
  // competitors
  createCompetitor,
  listCompetitors,
  updateCompetitor,
  deleteCompetitor,
  // attempts
  putAttempts,
}

export type M = typeof mutators
