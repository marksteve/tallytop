import type { TimeComponents } from 'parse-ms'

const MAX_DURATION = 5_940_000 // 99 mins

export const parseDuration = (text: string) => {
  let timeComponents = (text ?? '').split(':')
  const components = ['seconds', 'minutes']
  let nextDuration = {}
  components.forEach((unit) => {
    if (timeComponents.length) {
      nextDuration[unit] = parseFloat(timeComponents.pop()!)
    }
  })
  return Math.min(MAX_DURATION, toMilliseconds(nextDuration))
}

const getDurationParts = (timeOrMs: TimeComponents | number) => {
  const time = typeof timeOrMs === 'number' ? parseMs(timeOrMs) : timeOrMs
  return [
    time.days * 24 + time.hours > 0
      ? String(Math.trunc(time.days * 24 + time.hours)).padStart(2, '0')
      : null,
    String(Math.trunc(time.minutes)).padStart(2, '0'),
    String(Math.trunc(time.seconds + time.milliseconds / 1000)).padStart(
      2,
      '0',
    ),
  ].filter((p) => p !== null)
}

export const formatDuration = (timeOrMs: TimeComponents | number) => {
  return getDurationParts(timeOrMs).join(':')
}
