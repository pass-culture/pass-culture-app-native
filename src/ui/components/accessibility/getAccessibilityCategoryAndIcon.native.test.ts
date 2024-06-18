import { HandicapAudio } from 'ui/svg/icons/HandicapAudio'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { HandicapMotor } from 'ui/svg/icons/HandicapMotor'
import { HandicapVisual } from 'ui/svg/icons/HandicapVisual'

import {
  HandicapCategory,
  getAccessibilityCategoryAndIcon,
} from './getAccessibilityCategoryAndIcon'

describe('getAccessibilityCategoryAndIcon', () => {
  it('should return "Handicap visuel" for HandicapCategory.VISUAL', () => {
    const result = getAccessibilityCategoryAndIcon(HandicapCategory.VISUAL)

    expect(result.wording).toBe('Handicap visuel')
  })

  it('should return HandicapVisual icon for HandicapCategory.VISUAL', () => {
    const result = getAccessibilityCategoryAndIcon(HandicapCategory.VISUAL)

    expect(result.Icon).toBe(HandicapVisual)
  })

  it('should return "Handicap psychique ou cognitif" for HandicapCategory.MENTAL', () => {
    const result = getAccessibilityCategoryAndIcon(HandicapCategory.MENTAL)

    expect(result.wording).toBe('Handicap psychique ou cognitif')
  })

  it('should return HandicapMental icon for HandicapCategory.MENTAL', () => {
    const result = getAccessibilityCategoryAndIcon(HandicapCategory.MENTAL)

    expect(result.Icon).toBe(HandicapMental)
  })

  it('should return "Handicap moteur" for HandicapCategory.MOTOR', () => {
    const result = getAccessibilityCategoryAndIcon(HandicapCategory.MOTOR)

    expect(result.wording).toBe('Handicap moteur')
  })

  it('should return HandicapMotor icon for HandicapCategory.MOTOR', () => {
    const result = getAccessibilityCategoryAndIcon(HandicapCategory.MOTOR)

    expect(result.Icon).toBe(HandicapMotor)
  })

  it('should return "Handicap auditif" for HandicapCategory.AUDIO', () => {
    const result = getAccessibilityCategoryAndIcon(HandicapCategory.AUDIO)

    expect(result.wording).toBe('Handicap auditif')
  })

  it('should return HandicapAudio icon for HandicapCategory.AUDIO', () => {
    const result = getAccessibilityCategoryAndIcon(HandicapCategory.AUDIO)

    expect(result.Icon).toBe(HandicapAudio)
  })
})
