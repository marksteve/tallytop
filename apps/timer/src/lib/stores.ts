import { writable } from 'svelte/store'

export const timerQueue = writable([[5 * 60 * 1000, '5-min timer'] as const])

export const currentTimer = writable(0)
