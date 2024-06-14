import { getOpeningHoursStatus } from './getOpeningHoursStatus'

const dayFactory = {
  monday: (time: string) => new Date(`2024-05-13T${time}`),
  saturday: (time: string) => new Date(`2024-05-11T${time}`),
}

describe('OpeningHoursStatusViewModel', () => {
  it.each([
    {
      openingHours: 'MONDAY',
      currentDate: new Date('2024-05-13T09:00:00'),
    },
    {
      openingHours: 'TUESDAY',
      currentDate: new Date('2024-05-14T09:00:00'),
    },
    {
      openingHours: 'WEDNESDAY',
      currentDate: new Date('2024-05-15T09:00:00'),
    },
    {
      openingHours: 'THURSDAY',
      currentDate: new Date('2024-05-16T09:00:00'),
    },
    {
      openingHours: 'FRIDAY',
      currentDate: new Date('2024-05-17T09:00:00'),
    },
    {
      openingHours: 'SATURDAY',
      currentDate: new Date('2024-05-18T09:00:00'),
    },
    {
      openingHours: 'SUNDAY',
      currentDate: new Date('2024-05-19T09:00:00'),
    },
  ])('should use current day $openingHours', ({ openingHours, currentDate }) => {
    const viewModel = getOpeningHoursStatus({
      openingHours: {
        [openingHours]: [{ open: '09:00', close: '19:00' }],
      },
      currentDate,
    })

    expect(viewModel.text).toEqual('Ouvert jusqu’à 19h')
  })

  describe('Venue is open', () => {
    const currentDate = new Date('2024-05-13T09:00:00')

    it.each([
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: new Date('2024-05-13T09:00:00'),
      },
      {
        openingHours: {
          MONDAY: [
            { open: '09:00', close: '12:00' },
            { open: '14:00', close: '19:00' },
          ],
        },
        currentDate: new Date('2024-05-13T16:00:00'),
      },
    ])('should be in open state', ({ openingHours, currentDate }) => {
      const viewModel = getOpeningHoursStatus({ openingHours, currentDate })

      expect(viewModel.state).toEqual('open')
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
      const viewModel = getOpeningHoursStatus({ openingHours, currentDate })

      expect(viewModel.text).toEqual(expected)
    })
  })

  describe('Venue open soon', () => {
    it.each([
      {
        openingHours: { MONDAY: [{ open: '09:00', close: '19:00' }] },
        currentDate: new Date('2024-05-13T08:00:00'),
      },
      {
        openingHours: {
          MONDAY: [
            { open: '09:00', close: '12:00' },
            { open: '14:00', close: '19:00' },
          ],
        },
        currentDate: new Date('2024-05-13T13:00:00'),
      },
    ])('should be in open-soon state', ({ openingHours, currentDate }) => {
      const viewModel = getOpeningHoursStatus({ openingHours, currentDate })

      expect(viewModel.state).toEqual('open-soon')
    })

    it.each([
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: new Date('2024-05-13T08:00:00'),
        expected: 'Ouvre bientôt - 9h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '11:00', close: '19:00' }],
        },
        currentDate: new Date('2024-05-13T10:30:00'),
        expected: 'Ouvre bientôt - 11h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '11:30', close: '19:00' }],
        },
        currentDate: new Date('2024-05-13T10:30:00'),
        expected: 'Ouvre bientôt - 11h30',
      },
    ])('should have correct text $expected', ({ openingHours, currentDate, expected }) => {
      const viewModel = getOpeningHoursStatus({ openingHours, currentDate })

      expect(viewModel.text).toEqual(expected)
    })
  })

  describe('Venue close soon', () => {
    it('should be in close-soon state', () => {
      const openingHours = {
        MONDAY: [{ open: '09:00', close: '19:00' }],
      }
      const currentDate = new Date('2024-05-13T18:00:00')
      const viewModel = getOpeningHoursStatus({ openingHours, currentDate })

      expect(viewModel.state).toEqual('close-soon')
    })

    it.each([
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: dayFactory.monday('18:00:00'),
        expectedText: 'Ferme bientôt - 19h - Ouvre lundi prochain à 9h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '20:00' }],
        },
        currentDate: dayFactory.monday('19:00:00'),
        expectedText: 'Ferme bientôt - 20h - Ouvre lundi prochain à 9h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '20:30' }],
        },
        currentDate: dayFactory.monday('20:00:00'),
        expectedText: 'Ferme bientôt - 20h30 - Ouvre lundi prochain à 9h',
      },

      {
        openingHours: { MONDAY: [{ open: '09:00', close: '19:00' }] },
        currentDate: dayFactory.monday('18:00:00'),
        expectedText: 'Ferme bientôt - 19h - Ouvre lundi prochain à 9h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
          WEDNESDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: dayFactory.monday('18:00:00'),
        expectedText: 'Ferme bientôt - 19h - Ouvre mercredi à 9h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
          FRIDAY: [{ open: '10:00', close: '19:00' }],
        },
        currentDate: dayFactory.monday('18:00:00'),
        expectedText: 'Ferme bientôt - 19h - Ouvre vendredi à 10h',
      },
      {
        openingHours: {
          MONDAY: [
            { open: '09:00', close: '12:00' },
            { open: '15:00', close: '19:00' },
          ],
        },
        currentDate: dayFactory.monday('11:00:00'),
        expectedText: `Ferme bientôt - 12h - Ouvre aujourd’hui à 15h`,
      },
      {
        openingHours: {
          MONDAY: [
            { open: '09:00', close: '12:00' },
            { open: '15:30', close: '19:00' },
          ],
        },
        currentDate: dayFactory.monday('11:00:00'),
        expectedText: `Ferme bientôt - 12h - Ouvre aujourd’hui à 15h30`,
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
          TUESDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: dayFactory.monday('18:00:00'),
        expectedText: `Ferme bientôt - 19h - Ouvre demain à 9h`,
      },
      {
        openingHours: {
          SATURDAY: [{ open: '09:00', close: '19:00' }],
          SUNDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: dayFactory.saturday('18:00:00'),
        expectedText: `Ferme bientôt - 19h - Ouvre demain à 9h`,
      },
    ])('should have correct text $expectedText', ({ openingHours, currentDate, expectedText }) => {
      const viewModel = getOpeningHoursStatus({ openingHours, currentDate })

      expect(viewModel.text).toEqual(expectedText)
    })
  })

  describe('Venue is closed', () => {
    it.each([
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: new Date('2024-05-13T20:00:00'),
      },
      {
        openingHours: {
          MONDAY: [
            { open: '09:00', close: '12:00' },
            { open: '14:00', close: '19:00' },
          ],
        },
        currentDate: new Date('2024-05-13T20:00:00'),
      },
      {
        openingHours: {
          MONDAY: undefined,
        },
        currentDate: new Date('2024-05-13T20:00:00'),
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: new Date('2024-05-13T07:00:00'),
      },
    ])('should be in close state', ({ openingHours, currentDate }) => {
      const viewModel = getOpeningHoursStatus({ openingHours, currentDate })

      expect(viewModel.state).toEqual('close')
    })

    it.each([
      {
        openingHours: { MONDAY: undefined },
        currentDate: dayFactory.monday('20:00:00'),
        expectText: 'Fermé',
      },
      {
        openingHours: { MONDAY: [{ open: '09:00', close: '19:00' }] },
        currentDate: dayFactory.monday('20:00:00'),
        expectText: 'Fermé - Ouvre lundi prochain à 9h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
          WEDNESDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: dayFactory.monday('20:00:00'),
        expectText: 'Fermé - Ouvre mercredi à 9h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
          FRIDAY: [{ open: '10:00', close: '19:00' }],
        },
        currentDate: dayFactory.monday('20:00:00'),
        expectText: 'Fermé - Ouvre vendredi à 10h',
      },
      {
        openingHours: {
          MONDAY: [
            { open: '09:00', close: '12:00' },
            { open: '15:00', close: '19:00' },
          ],
        },
        currentDate: dayFactory.monday('13:00:00'),
        expectText: `Fermé - Ouvre aujourd’hui à 15h`,
      },
      {
        openingHours: {
          MONDAY: [
            { open: '09:00', close: '12:00' },
            { open: '15:30', close: '19:00' },
          ],
        },
        currentDate: dayFactory.monday('13:00:00'),
        expectText: `Fermé - Ouvre aujourd’hui à 15h30`,
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
          TUESDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: dayFactory.monday('20:00:00'),
        expectText: `Fermé - Ouvre demain à 9h`,
      },
      {
        openingHours: {
          SATURDAY: [{ open: '09:00', close: '19:00' }],
          SUNDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: dayFactory.saturday('20:00:00'),
        expectText: `Fermé - Ouvre demain à 9h`,
      },
    ])('should have correct text', ({ openingHours, currentDate, expectText }) => {
      const viewModel = getOpeningHoursStatus({
        openingHours,
        currentDate,
      })

      expect(viewModel.text).toEqual(expectText)
    })

    it.each([
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: new Date('2024-05-13T18:00:00'),
        expectedNextChange: new Date('2024-05-13T19:00:00'),
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: new Date('2024-05-13T07:00:00'),
        expectedNextChange: new Date('2024-05-13T08:00:00'),
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: new Date('2024-05-13T12:00:00'),
        expectedNextChange: new Date('2024-05-13T18:00:00'),
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '19:00' }],
        },
        currentDate: new Date('2024-05-13T08:30:00'),
        expectedNextChange: new Date('2024-05-13T09:00:00'),
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '18:00' }],
          FRIDAY: [{ open: '09:00', close: '18:00' }],
        },
        currentDate: new Date('2024-05-13T19:00:00'),
        expectedNextChange: undefined,
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '18:00' }],
          TUESDAY: [{ open: '09:00', close: '18:00' }],
        },
        currentDate: new Date('2024-05-13T19:00:00'),
        expectedNextChange: new Date('2024-05-14T08:00:00'),
      },
    ])(
      'should indicate next state change date $expectedNextChange',
      ({ openingHours, currentDate, expectedNextChange }) => {
        const viewModel = getOpeningHoursStatus({ openingHours, currentDate })

        expect(viewModel.nextChange).toEqual(expectedNextChange)
      }
    )
  })
})
