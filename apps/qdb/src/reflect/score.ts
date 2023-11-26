import type { ReadTransaction, WriteTransaction } from '@rocicorp/reflect'
import { listCompetitors } from './competitor'

export const putAttempts = async (
  tx: WriteTransaction,
  attempts: { key: string[]; value: string },
) => {
  await tx.set(['attempts', ...attempts.key].join('/'), attempts.value)
}

export const getAttempts = (tx: ReadTransaction, key: string[]) => {
  return tx.get<string>(['attempts', ...key].join('/'))
}

export const promoteCompetitors = async (
  tx: WriteTransaction,
  selected: { key: string[]; value: string[] },
) => {
  await tx.set(['promoted', ...selected.key].join('/'), selected.value)
}

export const listPromotedCompetitors = async (
  tx: ReadTransaction,
  key: string[],
) => {
  const promoted =
    (await tx.get<string[]>(['promoted', ...key].join('/'))) ?? []
  return (await listCompetitors(tx)).filter((c) => promoted.includes(c.id))
}
