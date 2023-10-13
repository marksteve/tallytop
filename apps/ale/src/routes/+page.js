import noviceData from './novice.json'
import interData from './inter.json'
import openData from './open.json'

const problems = ['Boulder 1', 'Boulder 2', 'Boulder 3', 'Boulder 4']
const attempts = 5

const getEliminated = (parsed, elimCount) =>
  problems.map((_, p) => {
    const sorted = [...parsed].sort((a, b) => {
      a = a.problems[p]
      b = b.problems[p]
      return (b.score - a.score) * 100 + (a.numAttempts - b.numAttempts)
    })
    return sorted.slice(sorted.length - elimCount[p]).map((c) => c.name)
  })

const parseScores = (scores) => {
  const parsed = scores.map((competitor) => {
    return {
      name: competitor.name,
      problems: problems.map((_, p) => {
        const competitorScores = Array(attempts)
          .fill(null)
          .map((_, a) => {
            const score = competitor[`${p + 1}-${a + 1}`]
            return parseFloat(score === '' ? 0 : score)
          })
        const score = Math.max(...competitorScores)
        const scoreIndex = competitorScores.indexOf(score)
        const numAttempts = scoreIndex + 1
        return {
          scores: competitorScores,
          score,
          scoreIndex,
          numAttempts,
        }
      }),
    }
  })
  return parsed
}

export function load() {
  const novice = parseScores(noviceData)
  const inter = parseScores(interData)
  const open = parseScores(openData)
  return {
    problems,
    attempts,
    novice: {
      competitors: novice,
      eliminated: getEliminated(novice, [2, 4, 5]),
    },
    inter: {
      competitors: inter,
      eliminated: getEliminated(inter, [2, 4, 5]),
    },
    open: {
      competitors: open,
      eliminated: getEliminated(open, [2, 4, 6]),
    },
  }
}
