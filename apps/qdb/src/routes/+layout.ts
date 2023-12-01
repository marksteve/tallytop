import { PUBLIC_REFLECT_URL } from '$env/static/public'
import { Reflect } from '@rocicorp/reflect/client'
import { mutators } from '../reflect/mutators'

import type { LayoutLoad } from './(spa)/$types'

export const load: LayoutLoad = async ({ data }) => {
  const r = new Reflect({
    ...data.credentials,
    roomID: 'qdb-2023',
    server: PUBLIC_REFLECT_URL,
    mutators,
    kvStore: 'idb',
  })

  return { ...data, r }
}

export const ssr = false
