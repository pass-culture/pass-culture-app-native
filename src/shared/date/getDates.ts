import { startOfDay } from 'date-fns'

type BuildTuple<L extends number, T extends unknown[] = []> = T['length'] extends L
  ? T
  : BuildTuple<L, [...T, Date]>

export function getDates<L extends number>(start: Date, count: L): BuildTuple<L> {
  const dates: Date[] = [startOfDay(start)]
  for (let i = 1; i < count; i++) {
    const newDate = new Date(start)
    newDate.setDate(start.getDate() + i)
    dates.push(startOfDay(newDate))
  }
  return dates as BuildTuple<L>
}
