export const qualisScore = (tally: any) => {
  return tally.top
    ? (tally.attempts === 1 ? 2 : 1) * parseFloat(tally.problem) -
        (tally.attempts > 1 ? tally.attempts - 1 : 0) * 0.2
    : 0
}
