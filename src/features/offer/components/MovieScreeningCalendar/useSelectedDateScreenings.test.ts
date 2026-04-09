import { convertToMinutes } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'

describe('convertToMinutes', () => {
  it.each`
    time      | expected
    ${''}     | ${0}
    ${'123'}  | ${0}
    ${'abc'}  | ${0}
    ${'2h30'} | ${150}
    ${'0h45'} | ${45}
    ${'1h00'} | ${60}
  `('should convert "${time}" to ${expected}', ({ time, expected }) => {
    expect(convertToMinutes(time)).toBe(expected)
  })
})
