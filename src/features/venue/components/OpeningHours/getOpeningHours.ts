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

export const getOpeningHours = (openingHours: OpeningHours) => {
  const getHours = (day: keyof OpeningHours) => {
    const hours = openingHours[day]
    if (!hours) return 'Fermé'
    return hours.map((hour) => hour.open + ' - ' + hour.close).join(' / ')
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
