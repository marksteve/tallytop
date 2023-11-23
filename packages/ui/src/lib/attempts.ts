export const attemptsToText = (attempts: string) => {
  const ta = attempts.indexOf('t') + 1
  const za = attempts.indexOf('z') + 1
  return [ta ? `T${ta}` : `T0`, za ? `Z${za}` : ta ? `Z${ta}` : `Z0`].join(' ')
}
