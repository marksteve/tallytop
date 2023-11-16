import type { WriteTransaction } from '@rocicorp/reflect'

export const putAttempts = async (
  tx: WriteTransaction,
  attempts: { key: string; value: string },
) => {
  await tx.set(attempts.key, attempts.value)
}
