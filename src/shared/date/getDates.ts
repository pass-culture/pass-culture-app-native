export function getDates(start: Date, count: number): Date[] {
  const dates: Date[] = [start]
  for (let i = 1; i < count; i++) {
    const newDate = new Date(start)
    newDate.setDate(start.getDate() + i)
    dates.push(newDate)
  }
  return dates
}
