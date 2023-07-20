import { createRelationships, createStore } from 'tinybase/with-schemas'

export const store = createStore().setSchema({
  competitors: {
    name: { type: 'string' },
    bib: { type: 'number' },
  },
  qualis_problems: {
    score: { type: 'number' },
  },
  qualis_tally: {
    competitor: { type: 'number' },
    problem: { type: 'number' },
    attempts: { type: 'number' },
  },
})

const relationships = createRelationships(store)
relationships.setRelationshipDefinition(
  'qualis_tally_competitors',
  'qualis_tally',
  'competitors',
  'competitor'
)
