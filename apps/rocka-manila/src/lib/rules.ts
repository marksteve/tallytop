export const qualisProblemsCutoff = 5

export const qualisScore = (tally: any) => {
  const flash = tally.attempts === 1
  return Math.max(
    0,
    tally.top
      ? parseFloat(tally.problem) + (flash ? 2 : 0) - (flash ? 0 : tally.attempts - 1) * 0.2
      : 0
  )
}

export const finalsCutoff = 6

export const podiumCutoff = 3
