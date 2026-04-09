import { getClubAdviceCardTitle } from 'features/clubAdvices/helpers/getClubAdviceCardTitle'

const subtitle = 'Membre du Book Club'

describe('getClubAdviceCardTitle', () => {
  it('should return "Membre du Book Club" when author not defined', () => {
    expect(getClubAdviceCardTitle(subtitle)).toEqual('Membre du Book Club')
  })

  it('should return "Membre du Book Club" when author is null', () => {
    expect(getClubAdviceCardTitle(subtitle, null)).toEqual('Membre du Book Club')
  })

  it('should return "Membre du Book Club" when author has only an age', () => {
    expect(getClubAdviceCardTitle(subtitle, { age: 18 })).toEqual('Membre du Book Club')
  })

  it('should return author firstname when defined', () => {
    expect(getClubAdviceCardTitle(subtitle, { firstName: 'Alice' })).toEqual('Alice')
  })

  it('should return author age and firstname when defined', () => {
    expect(getClubAdviceCardTitle(subtitle, { firstName: 'Alice', age: 18 })).toEqual(
      'Alice, 18 ans'
    )
  })

  it('should return "Membre du Book Club" when author firstname is an empty string', () => {
    expect(getClubAdviceCardTitle(subtitle, { firstName: '', age: 18 })).toBe('Membre du Book Club')
  })
})
