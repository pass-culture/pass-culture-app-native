import { ChronicleAuthor } from 'api/gen'

export function getChronicleCardTitle(author?: ChronicleAuthor | null) {
  if (!author?.firstName) {
    return 'Membre du Book Club'
  }
  if (author?.age) {
    return `${author.firstName}, ${author.age} ans`
  }
  return author.firstName
}
