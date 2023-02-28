import { intervalToDuration } from 'date-fns'

export const getAge = (birthDate: string) => {
  const today = new Date()
  const birthDateDate = new Date(birthDate)
  const age = intervalToDuration({
    start: birthDateDate,
    end: today,
  })
  return age.years
}
