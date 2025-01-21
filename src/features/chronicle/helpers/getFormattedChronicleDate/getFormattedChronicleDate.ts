export function getFormattedChronicleDate(chronicleDate: string) {
  const date = new Date(chronicleDate)
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(date)

  return formattedDate.replace(/^\w/, (c) => c.toUpperCase())
}
