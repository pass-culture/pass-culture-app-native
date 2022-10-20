import React from 'react'

import { render } from 'tests/utils/web'
import { AccessibilityAtom } from 'ui/components/accessibility/AccessibilityAtom'
import {
  getIconAndWording,
  HandicapCategory,
} from 'ui/components/accessibility/AccessibilityAtom.service'
import { HandicapAudio } from 'ui/svg/icons/HandicapAudio'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { HandicapMotor } from 'ui/svg/icons/HandicapMotor'
import { HandicapVisual } from 'ui/svg/icons/HandicapVisual'

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
    expect(queryByTestId('invalidTestId')).toBeFalsy()
    expect(queryByTestId('validTestId')).toBeTruthy()
  })
  it('should displat the invalidIcon when isValid is false', () => {
    const { queryByTestId } = render(
      <AccessibilityAtom handicap={HandicapCategory.MENTAL} isAccessible={false} />
    )
    expect(queryByTestId('invalidTestId')).toBeTruthy()
    expect(queryByTestId('validTestId')).toBeFalsy()
  })
  it('uses sideSpace to overgrow textContainer', async () => {
    const { getByTestId } = render(
      <AccessibilityAtom
        rightSpacingValue={10}
        handicap={HandicapCategory.MENTAL}
        isAccessible={false}
      />
    )
    const container = getByTestId('accessibilityAtomContainer')
    expect(container.style.marginRight).toEqual('10px')
  })
})
