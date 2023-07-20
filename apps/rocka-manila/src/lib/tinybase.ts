import { createSessionPersister } from 'tinybase/persisters/persister-browser'
import { createStore, createRelationships } from 'tinybase/with-schemas'

export const store = createStore().setSchema({
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

export const relationships = createRelationships(store)
relationships.setRelationshipDefinition(
  'qualis_competitors',
  'qualis_tally',
  'competitors',
  'competitor'
)

const persister = createSessionPersister(store, 'petStore')
persister.startAutoLoad()
persister.startAutoSave()

export const listTable = (table: any) =>
  Object.entries(table).map(([id, item]) => ({ id, ...item }))
