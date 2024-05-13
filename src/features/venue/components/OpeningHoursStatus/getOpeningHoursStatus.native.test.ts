import { getOpeningHoursStatus } from './getOpeningHoursStatus'

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
    it('should be in open-soon state', () => {
      const openingHours = {
        MONDAY: [{ open: '09:00', close: '19:00' }],
      }
      const currentDate = new Date('2024-05-13T08:00:00')
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
        currentDate: new Date('2024-05-13T18:00:00'),
        expected: 'Ferme bientôt - 19h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '20:00' }],
        },
        currentDate: new Date('2024-05-13T19:00:00'),
        expected: 'Ferme bientôt - 20h',
      },
      {
        openingHours: {
          MONDAY: [{ open: '09:00', close: '20:30' }],
        },
        currentDate: new Date('2024-05-13T20:00:00'),
        expected: 'Ferme bientôt - 20h30',
      },
    ])('should have correct text $expected', ({ openingHours, currentDate, expected }) => {
      const viewModel = getOpeningHoursStatus({ openingHours, currentDate })

      expect(viewModel.text).toEqual(expected)
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
    ])('should be in close state', ({ openingHours, currentDate }) => {
      const viewModel = getOpeningHoursStatus({ openingHours, currentDate })

      expect(viewModel.state).toEqual('close')
    })

    it('should have correct text', () => {
      const viewModel = getOpeningHoursStatus({
        openingHours: { MONDAY: undefined },
        currentDate: new Date('2024-05-13T20:00:00'),
      })

      expect(viewModel.text).toEqual('Fermé')
    })
  })
})
