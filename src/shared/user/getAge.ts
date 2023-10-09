import { intervalToDuration } from 'date-fns'

export function getAge(birthDate: string): number
export function getAge(birthDate?: string | null): number | undefined

export function getAge(birthDate?: string | null) {
  if (!birthDate) return

  const today = new Date()
  const birthDateDate = new Date(birthDate)
  const age = intervalToDuration({
    start: birthDateDate,
    end: today,
  })
  return age.years
}
