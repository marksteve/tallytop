import { writable } from 'svelte/store'
import { parseDuration } from '$lib/components/Timer.svelte'

export const timerQueue = (() => {
  const { update, ...store } = writable(
    [{ description: 'Climb', duration: 4 * 60 * 1000 }],
    // Array(40)
    //   .fill([
    //     {
    //       description: 'Climb',
    //       duration: 4 * 60 * 1000
    //     },
    //     {
    //       description: 'Prepare',
    //       duration: 15 * 1000
    //     }
    //   ])
    //   .flat()
  )

  return {
    ...store,
    newTimer() {
      update((value) => [
        ...value,
        { description: 'Enter description', duration: 60 * 1000 },
      ])
    },
    updateTimerDescription(index: number, description: string) {
      update((value) => {
        value[index].description = description
        return value
      })
    },
    updateTimerDuration(index: number, duration: string | number) {
      update((value) => {
        value[index].duration =
          typeof duration === 'string' ? parseDuration(duration) : duration
        return value
      })
    },
    removeTimer(index: number) {
      update((value) => {
        const nextValue = value.filter((_, i) => i !== index)
        if (nextValue.length > 0) {
          // Get latest index
          let nextIndex = index
          while (nextIndex > nextValue.length - 1) {
            nextIndex--
          }
          currentTimer.set(nextIndex)
          return nextValue
        } else {
          // Create a new one
          currentTimer.set(0)
          return [{ description: 'Enter description', duration: 60 * 1000 }]
        }
      })
    },
  }
})()

export const currentTimer = writable(0)
