import { HocuspocusProvider } from '@hocuspocus/provider'
import { readable } from 'svelte/store'
import type { Store } from 'tinybase'
import { createYjsPersister } from 'tinybase/persisters/persister-yjs'
import { createRelationships, createStore } from 'tinybase/with-schemas'
import { IndexeddbPersistence } from 'y-indexeddb'
import * as Y from 'yjs'
import { categories } from './constants'

const getStore = (name: string) => {
  const store = createStore().setSchema({
    competitors: {
      bib: { type: 'number' },
      name: { type: 'string' },
    },
    qualis_tally: {
      competitor: { type: 'string' },
      problem: { type: 'string' },
      attempts: { type: 'number' },
      top: { type: 'boolean' },
    },
  })
  const relationships = createRelationships(store)
  relationships.setRelationshipDefinition(
    'qualis_competitors',
    'qualis_tally',
    'competitors',
    'competitor'
  )
  const ydoc = new Y.Doc()
  new IndexeddbPersistence(name, ydoc)
  new HocuspocusProvider({
    url: 'ws://localhost:1234',
    name,
    document: ydoc,
  })
  const persister = createYjsPersister(store as Store, ydoc)
  persister.startAutoLoad()
  persister.startAutoSave()
  return { store, relationships }
}

export const stores = readable<Record<string, any>>(
  Object.fromEntries(Object.keys(categories).map((category) => [category, getStore(category)]))
)

export const listTable = (table: any) =>
  Object.entries(table).map(([id, item]) => ({ id, ...item }))
