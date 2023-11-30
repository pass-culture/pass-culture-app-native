import {
  formatLoginDate,
  formatOsAndSource,
  formatTokenInfo,
} from 'features/trustedDevice/helpers/formatTokenInfo'

describe('formatLoginDate', () => {
  it('should be Indéterminé when no date is provided', () => {
    const formattedDate = formatLoginDate()

    expect(formattedDate).toBe('Indéterminé')
  })

  it('should correctly format date and time when date is valid', () => {
    const formattedDate = formatLoginDate('2023-06-09T10:30:00Z')

    expect(formattedDate).toBe('Le 09/06/2023 à 10h30')
  })

  it('should be Indéterminé when invalid date is provided', () => {
    const formattedDate = formatLoginDate('23-06-09')

    expect(formattedDate).toBe('Indéterminé')
  })
})

describe('formatOsAndSource', () => {
  it('should be Indéterminé when no info is provided', () => {
    const formattedDate = formatOsAndSource()

    expect(formattedDate).toBe('Indéterminé')
  })

  it('should correctly format info (without -) when only OS is provided', () => {
    const formattedDate = formatOsAndSource('iOS')

    expect(formattedDate).toBe('iOS')
  })

  it('should correctly format info (without -) when only source is provided', () => {
    const formattedDate = formatOsAndSource(undefined, 'iPhone 13')

    expect(formattedDate).toBe('iPhone 13')
  })

  it('should correctly format info (with -) when os and source are provided', () => {
    const formattedDate = formatOsAndSource('iOS', 'iPhone 13')

    expect(formattedDate).toBe('iOS - iPhone 13')
  })
})

describe('formatTokenInfo', () => {
  it('should set info to default value when no info is provided', () => {
    const formattedDate = formatTokenInfo()

    expect(formattedDate).toEqual({
      location: 'Indéterminé',
      osAndSource: 'Indéterminé',
      loginDate: 'Indéterminé',
    })
  })

  it('should correctly format token info', () => {
    const formattedDate = formatTokenInfo({
      exp: 1_701_938_018,
      user_id: 1,
      data: {
        location: 'Paris',
        dateCreated: '2023-06-09T14:15:00Z',
        os: 'iOS',
        source: 'iPhone 13',
      },
    })

    expect(formattedDate).toEqual({
      location: 'Paris',
      osAndSource: 'iOS - iPhone 13',
      loginDate: 'Le 09/06/2023 à 14h15',
    })
  })
})
