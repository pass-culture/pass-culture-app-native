export type OpeningHours = Partial<{
  MONDAY: OpeningHour
  TUESDAY: OpeningHour
  WEDNESDAY: OpeningHour
  THURSDAY: OpeningHour
  FRIDAY: OpeningHour
  SATURDAY: OpeningHour
  SUNDAY: OpeningHour
}>

type OpeningHour = {
  open: string
  close: string
}[]

type OpeningDaysAndHours = { days: { label: string; hours: string }[] } | { days: null }

export const getOpeningHours = (openingHours: OpeningHours): OpeningDaysAndHours => {
  const hasOpenDay = Object.values(openingHours).some((value) => !!value && value.length > 0)
  if (!hasOpenDay) return { days: null }

  const getHours = (day: keyof OpeningHours) => {
    const hours = openingHours[day]
    if (!hours) return 'Fermé'
    return hours.map((hour) => `${hour.open} - ${hour.close}`).join(' / ')
  }

  return {
    days: [
      { label: 'Lundi', hours: getHours('MONDAY') },
      { label: 'Mardi', hours: getHours('TUESDAY') },
      { label: 'Mercredi', hours: getHours('WEDNESDAY') },
      { label: 'Jeudi', hours: getHours('THURSDAY') },
      { label: 'Vendredi', hours: getHours('FRIDAY') },
      { label: 'Samedi', hours: getHours('SATURDAY') },
      { label: 'Dimanche', hours: getHours('SUNDAY') },
    ],
  }
}
