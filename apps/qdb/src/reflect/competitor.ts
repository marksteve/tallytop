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

export const createCompetitor = async (
  tx: WriteTransaction,
  competitor: Omit<Competitor, 'number'>,
) => {
  const number =
    (await listCompetitorsByCategory(tx, competitor.category)).length + 1
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
