export const qualisScore = (tally: any) => {
  const flash = tally.attempts === 1
  return Math.max(
    0,
    tally.top
      ? parseFloat(tally.problem) + (flash ? 2 : 0) - (flash ? 0 : tally.attempts - 1) * 0.2
      : 0
  )
}
