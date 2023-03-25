import { writable } from 'svelte/store'
import { parseDuration } from '@tallytop/ui'

export const timerQueue = (() => {
  const { update, ...store } = writable(
    Array(40)
      .fill([
        {
          description: 'Climb',
          duration: 4 * 60 * 1000
        },
        {
          description: 'Prepare',
          duration: 15 * 1000
        }
      ])
      .flat()
  )

  return {
    ...store,
    newTimer() {
      update((value) => [...value, { description: 'Enter description', duration: 60 * 1000 }])
    },
    updateTimerDescription(index: number, description: string) {
      update((value) => {
        value[index].description = description
        return value
      })
    },
    updateTimerDuration(index: number, duration: string | number) {
      update((value) => {
        value[index].duration = typeof duration === 'string' ? parseDuration(duration) : duration
        return value
      })
    },
    removeTimer(index: number) {
      update((value) => value.filter((_, i) => i !== index))
    }
  }
})()

export const currentTimer = writable(0)
