import { generate } from '@rocicorp/rails'
import type { ReadTransaction, WriteTransaction } from '@rocicorp/reflect'

export type Competitor = {
  id: string
  number: number
  name: string
  category: 'open-m' | 'open-w'
}

export const {
  put: putCompetitor,
  get: getCompetitor,
  update: updateCompetitor,
  delete: deleteCompetitor,
  list: listCompetitors,
} = generate<Competitor>('competitor')

const numberPrefix = {
  'open-m': 100,
  'open-w': 200,
}

export const createCompetitor = async (
  tx: WriteTransaction,
  competitor: Omit<Competitor, 'number'>,
) => {
  const number =
    numberPrefix[competitor.category] +
    (await listCompetitorsByCategory(tx, competitor.category)).length +
    1
  await putCompetitor(tx, { ...competitor, number })
}

const sortByNumber = (a: Competitor, b: Competitor) => a.number - b.number

export const listCompetitorsByCategory = async (
  tx: ReadTransaction,
  category: Competitor['category'],
) => {
  return (await listCompetitors(tx))
    .filter((c) => c.category === category)
    .toSorted(sortByNumber)
}

export type Score = {
  t: number
  z: number
  ta: number
  za: number
}

const getScore = (attempts: string): Score => {
  const ta = attempts.indexOf('t') + 1
  const za = attempts.indexOf('z') + 1
  return {
    t: ta > 0 ? 1 : 0,
    z: ta + za > 0 ? 1 : 0,
    ta: ta || 0,
    za: za || ta || 0,
  }
}

export type CompetitorWithScores = Competitor & {
  scores: Record<string, Score>
}

export const listCompetitorsWithScores = async (
  tx: ReadTransaction,
  {
    competitors,
    attemptsPrefix,
    numProblems,
  }: {
    competitors: Competitor[]
    attemptsPrefix: string[]
    numProblems: number
  },
): Promise<CompetitorWithScores[]> => {
  const attempts = await tx
    .scan({ prefix: ['attempts', ...attemptsPrefix].join('/') })
    .entries()
    .toArray()
  const scores: Record<string, Record<string, Score>> = {}
  for (let [key, value] of attempts) {
    const [competitor, problem] = key
      .split('/')
      .slice(attemptsPrefix.length + 1)
    scores[competitor] = scores[competitor] ?? {}
    scores[competitor][problem] = getScore(value as string)
    if (Object.keys(scores[competitor]).length === numProblems) {
      scores[competitor].total = Object.values(scores[competitor]).reduce(
        (a, b) => ({
          t: a.t + b.t,
          z: a.z + b.z,
          ta: a.ta + b.ta,
          za: a.za + b.za,
        }),
        { t: 0, z: 0, ta: 0, za: 0 },
      )
    }
  }
  return competitors.map((competitor) => ({
    ...competitor,
    scores: scores[competitor.id],
  }))
}
