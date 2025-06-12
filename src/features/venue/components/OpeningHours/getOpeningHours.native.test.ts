import { getOpeningHours } from './getOpeningHours'

describe('getOpeningHours', () => {
  it('should return null if day is hours is not provided', () => {
    const openingHoursViewModel = getOpeningHours({ MONDAY: undefined })

    expect(openingHoursViewModel.days).toEqual(null)
  })

  it('should return "Fermer" when day has no information', () => {
    const openingHoursViewModel = getOpeningHours({
      MONDAY: undefined,
      TUESDAY: [
        { open: '10:00', close: '12:00' },
        { open: '14:00', close: '20:00' },
      ],
    })

    expect(openingHoursViewModel).toEqual({
      days: expect.arrayContaining([
        {
          label: 'Lundi',
          hours: 'Fermé',
        },
      ]),
    })
  })

  it('should return hours when day has information', () => {
    const openingHoursViewModel = getOpeningHours({
      MONDAY: [
        {
          open: '08:00',
          close: '12:00',
        },
      ],
    })

    expect(openingHoursViewModel).toEqual({
      days: expect.arrayContaining([
        {
          label: 'Lundi',
          hours: '08:00 - 12:00',
        },
      ]),
    })
  })

  it('should concat hours when day has multiple informations', () => {
    const openingHoursViewModel = getOpeningHours({
      MONDAY: [
        { open: '08:00', close: '12:00' },
        { open: '14:00', close: '18:00' },
      ],
    })

    expect(openingHoursViewModel).toEqual({
      days: expect.arrayContaining([
        {
          label: 'Lundi',
          hours: '08:00 - 12:00 / 14:00 - 18:00',
        },
      ]),
    })
  })

  it('should return opening hours for all days', () => {
    const openingHoursViewModel = getOpeningHours({
      MONDAY: [{ open: '10:00', close: '20:00' }],
      TUESDAY: [
        { open: '10:00', close: '12:00' },
        { open: '14:00', close: '20:00' },
      ],
      WEDNESDAY: [
        { open: '10:00', close: '12:00' },
        { open: '14:00', close: '20:00' },
      ],
      THURSDAY: [
        { open: '10:00', close: '12:00' },
        { open: '14:00', close: '20:00' },
      ],
      FRIDAY: undefined,
      SATURDAY: [{ open: '09:00', close: '20:00' }],
      SUNDAY: undefined,
    })

    expect(openingHoursViewModel.days).toEqual([
      {
        label: 'Lundi',
        hours: '10:00 - 20:00',
      },
      {
        label: 'Mardi',
        hours: '10:00 - 12:00 / 14:00 - 20:00',
      },
      {
        label: 'Mercredi',
        hours: '10:00 - 12:00 / 14:00 - 20:00',
      },
      {
        label: 'Jeudi',
        hours: '10:00 - 12:00 / 14:00 - 20:00',
      },
      {
        label: 'Vendredi',
        hours: 'Fermé',
      },
      {
        label: 'Samedi',
        hours: '09:00 - 20:00',
      },
      {
        label: 'Dimanche',
        hours: 'Fermé',
      },
    ])
  })
})
