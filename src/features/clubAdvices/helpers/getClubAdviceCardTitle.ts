import { ChronicleAuthor } from 'api/gen'

export function getClubAdviceCardTitle(subtitle: string, author?: ChronicleAuthor | null) {
  if (!author?.firstName) {
    return subtitle
  }
  if (author?.age) {
    return `${author.firstName}, ${author.age} ans`
  }
  return author.firstName
}
