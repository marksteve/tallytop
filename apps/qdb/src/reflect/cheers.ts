import type { WriteTransaction } from '@rocicorp/reflect'

export const cheer = async (
  tx: WriteTransaction,
  { round, competitor }: { round: string; competitor: string },
) => {
  const key = ['cheers', round, competitor].join('/')
  const cheers = (await tx.get(key)) ?? 0
  await tx.set(key, cheers + 1)
}
