import { createSessionPersister } from 'tinybase/persisters/persister-browser'
import { createStore, createRelationships } from 'tinybase/with-schemas'

const stores: Record<string, any> = {}
const storeRelationships: Record<string, any> = {}

export const getStore = (name: string) => {
  let store = stores[name]
  store =
    store ??
    createStore().setSchema({
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
  const persister = createSessionPersister(store, name)
  persister.startAutoLoad()
  persister.startAutoSave()
  return store
}

export const getRelationships = (name: string) => {
  let relationships = storeRelationships[name]
  if (!relationships) {
    relationships = createRelationships(getStore(name))
    relationships.setRelationshipDefinition(
      'qualis_competitors',
      'qualis_tally',
      'competitors',
      'competitor'
    )
  }
  return relationships
}

export const listTable = (table: any) =>
  Object.entries(table).map(([id, item]) => ({ id, ...item }))
