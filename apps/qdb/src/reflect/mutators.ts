import type { WriteTransaction } from '@rocicorp/reflect'
import {
  createCompetitor,
  deleteCompetitor,
  listCompetitors,
  updateCompetitor,
} from './competitor'
import { promoteCompetitors, putAttempts } from './score'
import { createTeam, deleteTeam, listTeams, updateTeam } from './team'

const requireAdmin = (
  mutator: (tx: WriteTransaction, ...args: any[]) => Promise<void>,
) => {
  return (tx: WriteTransaction, ...args: any[]) => {
    if (tx.auth === undefined || tx.auth?.userID === 'admin') {
      return mutator(tx, ...args)
    }
    throw new Error('Unauthorized')
  }
}

export const mutators = {
  // teams
  createTeam: requireAdmin(createTeam),
  listTeams,
  updateTeam: requireAdmin(updateTeam),
  deleteTeam: requireAdmin(deleteTeam),
  // competitor
  createCompetitor: requireAdmin(createCompetitor),
  listCompetitors,
  updateCompetitor: requireAdmin(updateCompetitor),
  deleteCompetitor: requireAdmin(deleteCompetitor),
  // score
  putAttempts: requireAdmin(putAttempts),
  promoteCompetitors: requireAdmin(promoteCompetitors),
}

export type M = typeof mutators
