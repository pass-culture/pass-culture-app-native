export const convertToMinutes = (time: string): number => {
  const [hours, minutes] = time.split('h').map(Number)
  if (hours === undefined || minutes === undefined) return 0
  return hours * 60 + minutes
}
