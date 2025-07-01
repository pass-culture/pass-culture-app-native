import { getChronicleCardTitle } from 'shared/chronicle/getChronicleCardTitle/getChronicleCardTitle'

const subtitle = 'Membre du Book Club'

describe('getChronicleCardTitle', () => {
  it('should return "Membre du Book Club" when author not defined', () => {
    expect(getChronicleCardTitle(subtitle)).toEqual('Membre du Book Club')
  })

  it('should return "Membre du Book Club" when author is null', () => {
    expect(getChronicleCardTitle(subtitle, null)).toEqual('Membre du Book Club')
  })

  it('should return "Membre du Book Club" when author has only an age', () => {
    expect(getChronicleCardTitle(subtitle, { age: 18 })).toEqual('Membre du Book Club')
  })

  it('should return author firstname when defined', () => {
    expect(getChronicleCardTitle(subtitle, { firstName: 'Alice' })).toEqual('Alice')
  })

  it('should return author age and firstname when defined', () => {
    expect(getChronicleCardTitle(subtitle, { firstName: 'Alice', age: 18 })).toEqual(
      'Alice, 18 ans'
    )
  })

  it('should return "Membre du Book Club" when author firstname is an empty string', () => {
    expect(getChronicleCardTitle(subtitle, { firstName: '', age: 18 })).toBe('Membre du Book Club')
  })
})
