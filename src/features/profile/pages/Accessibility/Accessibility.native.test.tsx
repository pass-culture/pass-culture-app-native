import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { Accessibility } from 'features/profile/pages/Accessibility/Accessibility'
import { render, fireEvent, screen } from 'tests/utils'

describe('Accessibility', () => {
  it('should render correctly', () => {
    render(<Accessibility />)

    expect(screen).toMatchSnapshot()
  })

  it.each`
    route                         | title
    ${'AccessibilityActionPlan'}  | ${'Schéma pluriannuel'}
    ${'AccessibilityDeclaration'} | ${'Déclaration d’accessibilité'}
    ${'AccessibilityEngagement'}  | ${'Les engagements du pass Culture'}
    ${'RecommendedPaths'}         | ${'Parcours recommandés'}
  `('should navigate to $route when $title is clicked', ({ route, title }) => {
    render(<Accessibility />)

    const row = screen.getByText(title)
    fireEvent.press(row)

    expect(navigate).toHaveBeenCalledWith(route, undefined)
  })
})
