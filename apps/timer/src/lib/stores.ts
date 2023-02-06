import { writable } from 'svelte/store'

export const timerQueue = writable([
  {
    description: 'Climb',
    duration: 5 * 60 * 1000
  },
  {
    description: 'Prepare',
    duration: 15 * 1000
  },
  {
    description: 'Climb',
    duration: 5 * 60 * 1000
  },
  {
    description: 'Prepare',
    duration: 15 * 1000
  },
  {
    description: 'Climb',
    duration: 5 * 60 * 1000
  },
  {
    description: 'Prepare',
    duration: 15 * 1000
  },
  {
    description: 'Climb',
    duration: 5 * 60 * 1000
  },
  {
    description: 'Prepare',
    duration: 15 * 1000
  },
  {
    description: 'Climb',
    duration: 5 * 60 * 1000
  },
  {
    description: 'Prepare',
    duration: 15 * 1000
  },
  {
    description: 'Climb',
    duration: 5 * 60 * 1000
  }
])

export const currentTimer = writable(0)
