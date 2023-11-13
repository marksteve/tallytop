import { PUBLIC_REFLECT_URL } from '$env/static/public'
import { Reflect } from '@rocicorp/reflect/client'
import { mutators } from '../reflect/mutators'

export const r = new Reflect({
  userID: 'public',
  roomID: 'qdb-2023',
  server: PUBLIC_REFLECT_URL,
  mutators,
  kvStore: 'idb',
})
