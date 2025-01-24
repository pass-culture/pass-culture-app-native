export function getFormattedChronicleDate(dateString: string) {
  const date = new Date(dateString)
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(date)

  return formattedDate.replace(/^\w/, (c) => c.toUpperCase())
}
