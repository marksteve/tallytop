import { PUBLIC_REFLECT_URL } from '$env/static/public'
import { mutators } from '$reflect/mutators'
import { Reflect } from '@rocicorp/reflect/client'

export const r = new Reflect({
  userID: 'public',
  roomID: 'tallytop-timer',
  server: PUBLIC_REFLECT_URL,
  mutators,
})
