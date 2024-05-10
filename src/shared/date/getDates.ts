type BuildTuple<L extends number, T extends any[] = []> = T['length'] extends L
  ? T
  : BuildTuple<L, [...T, Date]>

export function getDates<L extends number>(start: Date, count: L): BuildTuple<L> {
  const dates: Date[] = [start]
  for (let i = 1; i < count; i++) {
    const newDate = new Date(start)
    newDate.setDate(start.getDate() + i)
    dates.push(newDate)
  }
  return dates as BuildTuple<L>
}
