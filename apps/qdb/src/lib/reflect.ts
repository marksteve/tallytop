import { Reflect } from '@rocicorp/reflect/client'
import { mutators } from '../reflect/mutators'

export const r = new Reflect({
  userID: 'public',
  roomID: 'qdb-2023',
  server: 'http://localhost:8080',
  mutators,
  kvStore: 'idb',

})
