import { generate } from '@rocicorp/rails'
import type { ReadTransaction, WriteTransaction } from '@rocicorp/reflect'
import { getScore, type Score } from './score'

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
  const number = 300 + (await listTeams(tx)).length + 1
  await putTeam(tx, { ...team, number })
}

export const scoreMultiplier = {
  mens: 1,
  womens: 1.5,
  youth: 2,
}

export const listTeamsWithScores = async (tx: ReadTransaction) => {
  const numProblems = 6
  const teams = await listTeams(tx)
  const attempts = await tx
    .scan({ prefix: ['attempts', 'teams'].join('/') })
    .entries()
    .toArray()
  const scores: Record<string, Record<string, Record<string, Score>>> = {}
  for (let [key, value] of attempts) {
    const [team, member, problem] = key.split('/').slice(2)
    scores[team] = scores[team] ?? {}
    scores[team][member] = scores[team][member] ?? {}
    scores[team][member][problem] = getScore(value as string)
    if (Object.keys(scores[team][member]).length === numProblems) {
      scores[team][member]['total'] = Object.values(
        scores[team][member],
      ).reduce((a, b) => {
        return {
          t: a.t + b.t,
          z: a.z + b.z,
          ta: a.ta + b.ta,
          za: a.za + b.za,
        }
      })
    }
  }
  return teams.map((team) => ({
    ...team,
    scores: {
      ...team.members.reduce(
        (a, b) => ({
          ...a,
          [b.id]: scores[team.id][b.id],
        }),
        {},
      ),
      total: team.members.reduce(
        (a, b) => ({
          t: a.t + scores[team.id][b.id].total.t * scoreMultiplier[b.category],
          z: a.z + scores[team.id][b.id].total.z * scoreMultiplier[b.category],
          ta: a.ta + scores[team.id][b.id].total.ta,
          za: a.za + scores[team.id][b.id].total.za,
        }),
        { t: 0, z: 0, ta: 0, za: 0 },
      ),
    },
  }))
}
