import React from 'react'

import { render } from 'tests/utils'
import { HandicapAudio } from 'ui/svg/icons/HandicapAudio'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { HandicapMotor } from 'ui/svg/icons/HandicapMotor'
import { HandicapVisual } from 'ui/svg/icons/HandicapVisual'

import { AccessibilityAtom } from './AccessibilityAtom'
import { getIconAndWording, HandicapCategory } from './AccessibilityAtom.service'

describe('getIconAndWording', () => {
  it.each`
    handicapCategory           | expectedIcon      | expectedWording
    ${HandicapCategory.MOTOR}  | ${HandicapMotor}  | ${'Handicap moteur'}
    ${HandicapCategory.VISUAL} | ${HandicapVisual} | ${'Handicap visuel'}
    ${HandicapCategory.AUDIO}  | ${HandicapAudio}  | ${'Handicap auditif'}
    ${HandicapCategory.MENTAL} | ${HandicapMental} | ${'Handicap psychique ou cognitif'}
  `(
    'should return $expectedIcon and $expectedWording when given $handicapCategory',
    ({
      handicapCategory,
      expectedIcon,
      expectedWording,
    }: {
      handicapCategory: HandicapCategory
      expectedIcon: React.FC
      expectedWording: string
    }) => {
      expect(getIconAndWording(handicapCategory)).toEqual({
        Icon: expectedIcon,
        wording: expectedWording,
      })
    }
  )
})
describe('AccessibilityAtom', () => {
  it('should display the validIcon when isValid is true', () => {
    const { queryByTestId } = render(
      <AccessibilityAtom handicap={HandicapCategory.MENTAL} isAccessible />
    )
    expect(queryByTestId('invalidTestId')).toBeNull()
    expect(queryByTestId('validTestId')).toBeTruthy()
  })
  it('should displat the invalidIcon when isValid is false', () => {
    const { queryByTestId } = render(
      <AccessibilityAtom handicap={HandicapCategory.MENTAL} isAccessible={false} />
    )
    expect(queryByTestId('invalidTestId')).toBeTruthy()
    expect(queryByTestId('validTestId')).toBeNull()
  })
})
