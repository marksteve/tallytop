import { readable } from 'svelte/store'
import type { Store } from 'tinybase'
import { createYjsPersister } from 'tinybase/persisters/persister-yjs'
import { createRelationships, createStore } from 'tinybase/with-schemas'
import * as Y from 'yjs'
import { categories } from './constants'

const initStore = () => {
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
    finals_tally: {
      competitor: { type: 'string' },
      problem: { type: 'string' },
      attempts: { type: 'string' },
    }
  })
  const relationships = createRelationships(store)
  relationships.setRelationshipDefinition(
    'qualis_competitors',
    'qualis_tally',
    'competitors',
    'competitor'
  )
  relationships.setRelationshipDefinition(
    'finals_competitors',
    'finals_tally',
    'competitors',
    'competitor'
  )
  const ydoc = new Y.Doc()
  const persister = createYjsPersister(store as Store, ydoc)
  persister.startAutoLoad()
  persister.startAutoSave()
  return { store, relationships, ydoc }
}

export const stores = readable<Record<string, any>>(
  Object.fromEntries(Object.keys(categories).map((category) => [category, initStore(category)]))
)

export const listTable = (table: any) =>
  Object.entries(table).map(([id, item]) => ({ id, ...item }))
