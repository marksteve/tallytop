export const formatScore = (score: number) =>
  score.toFixed(2).replace(/\.?0+$/, '')
