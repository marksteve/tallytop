import { cva } from 'class-variance-authority'

export const list = cva(['grid', '[grid-auto-rows:20vh]'])

export const listItem = cva([
  'border-current',
  'border-t',
  'flex',
  'items-center',
  'justify-center',
])
