import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { Accessibility } from 'features/profile/pages/Accessibility/Accessibility'
import { render, fireEvent } from 'tests/utils'

describe('Accessibility', () => {
  it('should render correctly', () => {
    const renderAPI = render(<Accessibility />)
    expect(renderAPI).toMatchSnapshot()
  })

  it.each`
    route                         | title
    ${'AccessibilityActionPlan'}  | ${'Schéma pluriannuel'}
    ${'AccessibilityDeclaration'} | ${'Déclaration d’accessibilité'}
    ${'AccessibilityEngagement'}  | ${'Les engagements du pass Culture'}
    ${'RecommendedPaths'}         | ${'Parcours recommandés'}
  `('should navigate to $route when $title is clicked', ({ route, title }) => {
    const { getByText } = render(<Accessibility />)

    const row = getByText(title)
    fireEvent.press(row)

    expect(navigate).toBeCalledWith(route, undefined)
  })
})
