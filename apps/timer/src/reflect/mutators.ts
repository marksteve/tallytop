import type { WriteTransaction } from '@rocicorp/reflect'
import type { TimeComponents } from 'parse-ms'

export const mutators = {
  start,
  stop,
  reset,
  tick,
  meta,
}

export type M = typeof mutators

async function start(tx: WriteTransaction, { id }: { id: string }) {
  await tx.set([id, 'status'].join('/'), 'running')
}

async function stop(tx: WriteTransaction, { id }: { id: string }) {
  await tx.set([id, 'status'].join('/'), 'stopped')
}

async function reset(
  tx: WriteTransaction,
  { id, time }: { id: string; time: TimeComponents },
) {
  await tx.set([id, 'time'].join('/'), time)
  await tx.set([id, 'status'].join('/'), 'stopped')
}

async function tick(
  tx: WriteTransaction,
  { id, time }: { id: string; time: TimeComponents },
) {
  await tx.set([id, 'time'].join('/'), time)
}

async function meta(
  tx: WriteTransaction,
  { id, meta }: { id: string; meta: { description: string; duration: number } },
) {
  await tx.set([id, 'meta'].join('/'), meta)
}
