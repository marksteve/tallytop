import { writable } from 'svelte/store'

export const timerQueue = writable([
  {
    description: '5-min timer',
    duration: 5 * 60 * 1000
  }
])

export const currentTimer = writable(0)
