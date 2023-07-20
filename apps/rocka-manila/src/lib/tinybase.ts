import { createSessionPersister } from 'tinybase/persisters/persister-browser'
import { createStore } from 'tinybase/with-schemas'

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
const persister = createSessionPersister(store, 'petStore')
persister.startAutoLoad()
persister.startAutoSave()

export const listTable = (table: any) =>
  Object.entries(table).map(([id, item]) => ({ id, ...item }))
