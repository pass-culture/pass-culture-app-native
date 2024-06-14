import {
  HandicapCategory,
  getAccessibilityCategoryAndIcon,
} from './getAccessibilityCategoryAndIcon'

describe('getAccessibilityCategoryAndIcon', () => {
  it('should return "Handicap visuel" for HandicapCategory.VISUAL', () => {
    const result = getAccessibilityCategoryAndIcon(HandicapCategory.VISUAL)

    expect(result.wording).toBe('Handicap visuel')
  })

  it('should return "Handicap psychique ou cognitif" for HandicapCategory.MENTAL', () => {
    const result = getAccessibilityCategoryAndIcon(HandicapCategory.MENTAL)

    expect(result.wording).toBe('Handicap psychique ou cognitif')
  })

  it('should return "Handicap moteur" for HandicapCategory.MOTOR', () => {
    const result = getAccessibilityCategoryAndIcon(HandicapCategory.MOTOR)

    expect(result.wording).toBe('Handicap moteur')
  })

  it('should return "Handicap auditif" for HandicapCategory.AUDIO', () => {
    const result = getAccessibilityCategoryAndIcon(HandicapCategory.AUDIO)

    expect(result.wording).toBe('Handicap auditif')
  })
})
