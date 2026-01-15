import { formatDuration } from 'features/offerRefacto/core'

describe('formatDuration', () => {
  describe('unit=min', () => {
    it('should format duration with a number of hours exactly', () => {
      expect(formatDuration(120)).toEqual({ label: '2h', accessibilityLabel: '2 heures' })
    })

    it('should format duration with only minutes which represent less than an hour', () => {
      expect(formatDuration(45)).toEqual({ label: '45min', accessibilityLabel: '45 minutes' })
    })

    it('should format duration with one hour exactly', () => {
      expect(formatDuration(60)).toEqual({ label: '1h', accessibilityLabel: '1 heures' })
    })

    it('should format duration with hours and minutes', () => {
      expect(formatDuration(75)).toEqual({ label: '1h15', accessibilityLabel: '1 heures 15' })
    })

    it('should format duration with hours and add a 0 before minutes when minutes are below 10', () => {
      expect(formatDuration(125)).toEqual({ label: '2h05', accessibilityLabel: '2 heures 05' })
    })
  })

  describe('unit=sec', () => {
    it('should format duration with seconds only', () => {
      expect(formatDuration(45, 'sec')).toEqual({ label: '45s', accessibilityLabel: '45 secondes' })
    })

    it('should format duration with minutes only', () => {
      expect(formatDuration(120, 'sec')).toEqual({ label: '2min', accessibilityLabel: '2 minutes' })
    })

    it('should format duration with minutes and seconds only', () => {
      expect(formatDuration(125, 'sec')).toEqual({
        label: '2min05',
        accessibilityLabel: '2 minutes 05',
      })
    })

    it('should format duration with hour only', () => {
      expect(formatDuration(3600, 'sec')).toEqual({ label: '1h', accessibilityLabel: '1 heures' })
    })

    it('should format duration with hour, minutes and seconds', () => {
      expect(formatDuration(3665, 'sec')).toEqual({
        label: '1h01',
        accessibilityLabel: '1 heures 01',
      })
    })
  })

  it('should format duration with zero duration', () => {
    expect(formatDuration(0)).toEqual({ label: '-', accessibilityLabel: 'Durée non définie' })
  })
})
