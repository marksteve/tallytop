import type { ReflectServerOptions } from '@rocicorp/reflect/server'
import { type M, mutators } from './mutators.js'
import type { Env } from '@rocicorp/reflect'

function makeOptions(): ReflectServerOptions<M> {
  return {
    mutators,
    authHandler: (auth: string, roomID: string, env: Env) => {
      if (auth === env.auth) {
        return { userID: 'admin', write: true }
      }
      return { userID: 'public' }
    },
  }
}

export { makeOptions as default }
