import { readable } from 'svelte/store'
import { createSessionPersister } from 'tinybase/persisters/persister-browser'
import { createRelationships, createStore } from 'tinybase/with-schemas'
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
  const persister = createSessionPersister(store, name)
  persister.startAutoLoad()
  persister.startAutoSave()
  return { store, relationships }
}

export const stores = readable<Record<string, any>>(
  Object.fromEntries(Object.keys(categories).map((category) => [category, getStore(category)]))
)

export const listTable = (table: any) =>
  Object.entries(table).map(([id, item]) => ({ id, ...item }))
