import { addWeeks } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'

import { getOpeningHoursStatus } from './getOpeningHoursStatus'

const createDayFactory = (timezone: string) => {
  const createDateWithTimezone = (date: Date) => zonedTimeToUtc(date, timezone)
  return {
    monday: (time: string) => createDateWithTimezone(new Date(`2024-05-13T${time}`)),
    tuesday: (time: string) => createDateWithTimezone(new Date(`2024-05-14T${time}`)),
    wednesday: (time: string) => createDateWithTimezone(new Date(`2024-05-15T${time}`)),
    thursday: (time: string) => createDateWithTimezone(new Date(`2024-05-16T${time}`)),
    friday: (time: string) => createDateWithTimezone(new Date(`2024-05-17T${time}`)),
    saturday: (time: string) => createDateWithTimezone(new Date(`2024-05-11T${time}`)),
    sunday: (time: string) => createDateWithTimezone(new Date(`2024-05-12T${time}`)),
  }
}

const PARIS_TIMEZONE = 'Europe/Paris'
const GUADELOUPE_TIMEZONE = 'America/Guadeloupe'

const paris = createDayFactory(PARIS_TIMEZONE)
const guadeloupe = createDayFactory(GUADELOUPE_TIMEZONE)

describe('OpeningHoursStatusViewModel', () => {
  it.each([
    {
      openingHours: 'MONDAY',
      currentDate: paris.monday('09:00:00'),
    },
    {
      openingHours: 'TUESDAY',
      currentDate: paris.tuesday('09:00:00'),
    },
    {
      openingHours: 'WEDNESDAY',
      currentDate: paris.wednesday('09:00:00'),
    },
    {
      openingHours: 'THURSDAY',
      currentDate: paris.thursday('09:00:00'),
    },
    {
      openingHours: 'FRIDAY',
      currentDate: paris.friday('09:00:00'),
    },
    {
      openingHours: 'SATURDAY',
      currentDate: paris.saturday('09:00:00'),
    },
    {
      openingHours: 'SUNDAY',
      currentDate: paris.sunday('09:00:00'),
    },
  ])('should use current day $openingHours', ({ openingHours, currentDate }) => {
    const viewModel = getOpeningHoursStatus({
      openingHours: {
        [openingHours]: [{ open: '09:00', close: '19:00' }],
      },
      currentDate,
      timezone: PARIS_TIMEZONE,
    })

    expect(viewModel.openingLabel).toEqual('Ouvert jusqu’à 19h')
  })

  describe('Venue is open', () => {
    const currentDate = paris.monday('09:00:00')

    it.each([
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.monday('09:00:00'),
      },
      {
        openingHours: {
          MONDAY: [
            { open: '09:00', close: '12:00' },
            { open: '14:00', close: '19:00' },
          ],
        },
        currentDate: paris.monday('16:00:00'),
      },
    ])('should be in open state', ({ openingHours, currentDate }) => {
      const viewModel = getOpeningHoursStatus({
        openingHours,
        currentDate,
        timezone: PARIS_TIMEZONE,
      })

      expect(viewModel.openingState).toEqual('open')
    })

    it.each([
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        expected: 'Ouvert jusqu’à 19h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '20:00' }],
        },
        expected: 'Ouvert jusqu’à 20h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:30' }],
        },
        expected: 'Ouvert jusqu’à 19h30',
      },
    ])('should have correct text $expected', ({ openingHours, expected }) => {
      const viewModel = getOpeningHoursStatus({
        openingHours,
        currentDate,
        timezone: PARIS_TIMEZONE,
      })

      expect(viewModel.openingLabel).toEqual(expected)
    })
  })

  describe('Venue open soon', () => {
    it.each([
      {
        openingHours: { MONDAY: [{ open: '09:00', close: '19:00' }] },
        currentDate: paris.monday('08:00:00'),
      },
      {
        openingHours: {
          MONDAY: [
            { open: '09:00', close: '12:00' },
            { open: '14:00', close: '19:00' },
          ],
        },
        currentDate: paris.monday('13:00:00'),
      },
    ])('should be in open-soon state', ({ openingHours, currentDate }) => {
      const viewModel = getOpeningHoursStatus({
        openingHours,
        currentDate,
        timezone: PARIS_TIMEZONE,
      })

      expect(viewModel.openingState).toEqual('open-soon')
    })

    it.each([
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.monday('08:00:00'),
        expected: 'Ouvre bientôt - 9h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '11:00', close: '19:00' }],
        },
        currentDate: paris.monday('10:30:00'),
        expected: 'Ouvre bientôt - 11h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '11:30', close: '19:00' }],
        },
        currentDate: paris.monday('10:30:00'),
        expected: 'Ouvre bientôt - 11h30',
      },
      {
        openingHours: { MONDAY: [{ open: '09:01', close: '19:00' }] },
        currentDate: paris.monday('08:30:00'),
        expected: 'Ouvre bientôt - 9h01',
      },
    ])('should have correct text $expected', ({ openingHours, currentDate, expected }) => {
      const viewModel = getOpeningHoursStatus({
        openingHours,
        currentDate,
        timezone: PARIS_TIMEZONE,
      })

      expect(viewModel.openingLabel).toEqual(expected)
    })
  })

  describe('Venue close soon', () => {
    it('should be in close-soon state', () => {
      const openingHours = {
        MONDAY: [{ open: '09:00', close: '19:00' }],
      }
      const currentDate = paris.monday('18:00:00')
      const viewModel = getOpeningHoursStatus({
        openingHours,
        currentDate,
        timezone: PARIS_TIMEZONE,
      })

      expect(viewModel.openingState).toEqual('close-soon')
    })

    it.each([
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.monday('18:00:00'),
        expectedText: 'Ferme bientôt - 19h - Ouvre lundi prochain à 9h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '20:00' }],
        },
        currentDate: paris.monday('19:00:00'),
        expectedText: 'Ferme bientôt - 20h - Ouvre lundi prochain à 9h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '20:30' }],
        },
        currentDate: paris.monday('20:00:00'),
        expectedText: 'Ferme bientôt - 20h30 - Ouvre lundi prochain à 9h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
          WEDNESDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.monday('18:00:00'),
        expectedText: 'Ferme bientôt - 19h - Ouvre mercredi à 9h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
          FRIDAY: [{ open: '10:00', close: '19:00' }],
        },
        currentDate: paris.monday('18:00:00'),
        expectedText: 'Ferme bientôt - 19h - Ouvre vendredi à 10h',
      },
      {
        openingHours: {
          MONDAY: [
            { open: '09:00', close: '12:00' },
            { open: '12:30', close: '18:00' },
          ],
        },
        currentDate: paris.monday('11:00:00'),
        expectedText: 'Ferme bientôt - 12h - Ouvre aujourd’hui à 12h30',
      },
      {
        openingHours: {
          MONDAY: [
            { open: '09:00', close: '12:00' },
            { open: '15:00', close: '19:00' },
          ],
        },
        currentDate: paris.monday('11:00:00'),
        expectedText: `Ferme bientôt - 12h - Ouvre aujourd’hui à 15h`,
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
          TUESDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.monday('18:00:00'),
        expectedText: `Ferme bientôt - 19h - Ouvre demain à 9h`,
      },
      {
        openingHours: {
          SATURDAY: [{ open: '09:00', close: '19:00' }],
          SUNDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.saturday('18:00:00'),
        expectedText: `Ferme bientôt - 19h - Ouvre demain à 9h`,
      },
    ])('should have correct text $expectedText', ({ openingHours, currentDate, expectedText }) => {
      const viewModel = getOpeningHoursStatus({
        openingHours,
        currentDate,
        timezone: PARIS_TIMEZONE,
      })

      expect(viewModel.openingLabel).toEqual(expectedText)
    })
  })

  describe('Venue closes soon, but actually stays open (overnight event)', () => {
    it('should have "open until" text', () => {
      const openingHours = {
        SATURDAY: [{ open: '21:00', close: '23:59' }],
        SUNDAY: [{ open: '00:00', close: '03:00' }],
      }
      const currentDate = paris.saturday('23:30:00')
      const viewModel = getOpeningHoursStatus({
        openingHours,
        currentDate,
        timezone: PARIS_TIMEZONE,
      })

      expect(viewModel.openingLabel).toEqual('Ouvert jusqu’à 3h')
    })
  })

  describe('Venue is closed', () => {
    it.each([
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.monday('20:00:00'),
      },
      {
        openingHours: {
          MONDAY: [
            { open: '09:00', close: '12:00' },
            { open: '14:00', close: '19:00' },
          ],
        },
        currentDate: paris.monday('20:00:00'),
      },
      {
        openingHours: {
          MONDAY: undefined,
        },
        currentDate: paris.monday('20:00:00'),
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.monday('07:00:00'),
      },
    ])('should be in close state', ({ openingHours, currentDate }) => {
      const viewModel = getOpeningHoursStatus({
        openingHours,
        currentDate,
        timezone: PARIS_TIMEZONE,
      })

      expect(viewModel.openingState).toEqual('close')
    })

    it.each([
      {
        openingHours: { MONDAY: undefined },
        currentDate: paris.monday('20:00:00'),
        expectText: 'Fermé',
      },
      {
        openingHours: { MONDAY: [{ open: '09:00', close: '19:00' }] },
        currentDate: paris.monday('20:00:00'),
        expectText: 'Fermé - Ouvre lundi prochain à 9h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
          WEDNESDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.monday('20:00:00'),
        expectText: 'Fermé - Ouvre mercredi à 9h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
          FRIDAY: [{ open: '10:00', close: '19:00' }],
        },
        currentDate: paris.monday('20:00:00'),
        expectText: 'Fermé - Ouvre vendredi à 10h',
      },
      {
        openingHours: {
          MONDAY: [
            { open: '09:00', close: '12:00' },
            { open: '15:00', close: '19:00' },
          ],
        },
        currentDate: paris.monday('13:00:00'),
        expectText: `Fermé - Ouvre aujourd’hui à 15h`,
      },
      {
        openingHours: {
          MONDAY: [
            { open: '00:00', close: '12:00' },
            { open: '15:30', close: '19:00' },
          ],
        },
        currentDate: paris.monday('13:00:00'),
        expectText: `Fermé - Ouvre aujourd’hui à 15h30`,
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
          TUESDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.monday('20:00:00'),
        expectText: `Fermé - Ouvre demain à 9h`,
      },
      {
        openingHours: {
          SATURDAY: [{ open: '09:00', close: '19:00' }],
          SUNDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.saturday('20:00:00'),
        expectText: `Fermé - Ouvre demain à 9h`,
      },
    ])('should have correct text', ({ openingHours, currentDate, expectText }) => {
      const viewModel = getOpeningHoursStatus({
        openingHours,
        currentDate,
        timezone: PARIS_TIMEZONE,
      })

      expect(viewModel.openingLabel).toEqual(expectText)
    })

    it.each([
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.monday('18:00:00'),
        expectedNextChange: paris.monday('19:00:00'),
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.monday('07:00:00'),
        expectedNextChange: paris.monday('09:00:00'),
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.monday('12:00:00'),
        expectedNextChange: paris.monday('19:00:00'),
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.monday('08:30:00'),
        expectedNextChange: paris.monday('09:00:00'),
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: paris.monday('19:30:00'),
        expectedNextChange: addWeeks(paris.monday('09:00:00'), 1),
      },
      {
        openingHours: {
          MONDAY: [],
          FRIDAY: undefined,
        },
        currentDate: paris.monday('19:00:00'),
        expectedNextChange: undefined,
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '18:00' }],
          TUESDAY: [{ open: '09:00', close: '18:00' }],
        },
        currentDate: paris.monday('19:00:00'),
        expectedNextChange: paris.tuesday('09:00:00'),
      },
    ])(
      'should indicate next state change date $expectedNextChange',
      ({ openingHours, currentDate, expectedNextChange }) => {
        const viewModel = getOpeningHoursStatus({
          openingHours,
          currentDate,
          timezone: PARIS_TIMEZONE,
        })

        expect(viewModel.nextChangeTime).toEqual(expectedNextChange)
      }
    )
  })

  describe('Venue is not on same timezone', () => {
    test('user is in paris and venue is in guadeloupe', () => {
      const openingHours = {
        MONDAY: [{ open: '09:00', close: '19:00' }],
      }
      const currentDate = paris.monday('20:00:00')
      const viewModel = getOpeningHoursStatus({
        openingHours,
        currentDate,
        timezone: GUADELOUPE_TIMEZONE,
      })

      expect(viewModel.openingLabel).toEqual('Ouvert jusqu’à 19h')
    })
  })

  test('user is in guadeloupe and venue is in paris', () => {
    const openingHours = {
      MONDAY: [{ open: '09:00', close: '19:00' }],
    }
    const currentDate = guadeloupe.monday('08:00:00')
    const viewModel = getOpeningHoursStatus({
      openingHours,
      currentDate,
      timezone: PARIS_TIMEZONE,
    })

    expect(viewModel.openingLabel).toEqual('Ouvert jusqu’à 19h')
  })

  it('should handle 00:00 to 23:59 opening hours for all days', () => {
    const fullWeekOpening = {
      MONDAY: [{ open: '00:00', close: '23:59' }],
      TUESDAY: [{ open: '00:00', close: '23:59' }],
      WEDNESDAY: [{ open: '00:00', close: '23:59' }],
      THURSDAY: [{ open: '00:00', close: '23:59' }],
      FRIDAY: [{ open: '00:00', close: '23:59' }],
      SATURDAY: [{ open: '00:00', close: '23:59' }],
      SUNDAY: [{ open: '00:00', close: '23:59' }],
    }

    const currentDate = paris.monday('12:00:00')
    const viewModel = getOpeningHoursStatus({
      openingHours: fullWeekOpening,
      currentDate,
      timezone: PARIS_TIMEZONE,
    })

    expect(viewModel.openingState).toEqual('open')
    expect(viewModel.openingLabel).toEqual('Ouvert jusqu’à 23h59')
  })
})
