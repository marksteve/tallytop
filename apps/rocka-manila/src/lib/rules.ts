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

export const finalsCutoff = {
  novice_men: 7,
  novice_women: 6,
  inter_men: 6,
  inter_women: 6,
}

export const countTops = (problems) => {
  return Object.values(problems).filter((problem) => problem.attempts.includes('T')).length
}

export const countTopAttempts = (problems) => {
  return Object.values(problems)
    .map((problem) => problem.attempts.indexOf('T') + 1)
    .reduce((prev, curr) => prev + curr, 0)
}

export const countZones = (problems) => {
  return Object.values(problems).filter((problem) => problem.attempts.includes('z') || problem.attempts.includes('T')).length
}

export const countZoneAttempts = (problems) => {
  return Object.values(problems)
    .map((problem) => problem.attempts.indexOf('z') + 1)
    .reduce((prev, curr) => prev + curr, 0)
}

export const podiumCutoff = 3
