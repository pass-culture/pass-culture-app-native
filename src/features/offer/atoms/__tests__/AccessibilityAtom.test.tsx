import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { HandicapAudio } from 'ui/svg/icons/HandicapAudio'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { HandicapMotor } from 'ui/svg/icons/HandicapMotor'
import { HandicapVisual } from 'ui/svg/icons/HandicapVisual'

import { AccessibilityAtom, HandicapCategory } from '../AccessibilityAtom'
import { getIconAndWording } from '../AccessibilityAtom.service'

describe('getIconAndWording', () => {
  it.each`
    handicapCategory           | expectedIcon      | expectedWording
    ${HandicapCategory.MOTOR}  | ${HandicapMotor}  | ${'Handicap moteur'}
    ${HandicapCategory.VISUAL} | ${HandicapVisual} | ${'Handicap visuel'}
    ${HandicapCategory.AUDIO}  | ${HandicapAudio}  | ${'Handicap auditif'}
    ${HandicapCategory.MENTAL} | ${HandicapMental} | ${'Handicap mental'}
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
      <AccessibilityAtom sideSpace={0} handicap={HandicapCategory.MENTAL} isAccessible={true} />
    )
    expect(queryByTestId('invalidTestId')).toBeFalsy()
    expect(queryByTestId('validTestId')).toBeTruthy()
  })
  it('should displat the invalidIcon when isValid is false', () => {
    const { queryByTestId } = render(
      <AccessibilityAtom sideSpace={0} handicap={HandicapCategory.MENTAL} isAccessible={false} />
    )
    expect(queryByTestId('invalidTestId')).toBeTruthy()
    expect(queryByTestId('validTestId')).toBeFalsy()
  })
  it('uses sideSpace to overgrow textContainer', async () => {
    const { getByTestId } = render(
      <AccessibilityAtom sideSpace={10} handicap={HandicapCategory.MENTAL} isAccessible={false} />
    )
    const textContainer = getByTestId('Handicap mental')
    expect(textContainer.props.style[0].width).toEqual(10)

    const accessibilityFrame = getByTestId('accessibilityFrame')
    fireEvent(accessibilityFrame, 'layout', { nativeEvent: { layout: { width: 25 } } })
    expect(textContainer.props.style[0].width).toEqual(35)
  })
})
