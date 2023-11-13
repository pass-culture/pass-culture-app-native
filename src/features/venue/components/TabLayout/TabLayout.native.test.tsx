import React from 'react'
import styled from 'styled-components/native'

import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { fireEvent, render, screen } from 'tests/utils'
import { Typo } from 'ui/theme'

const ExampleText = styled(Typo.Body)``
const tabPanels = {
  'Offres disponibles': <ExampleText>Offres disponibles content</ExampleText>,
  'Infos pratiques': <ExampleText>Infos pratiques content</ExampleText>,
}

describe('TabLayout', () => {
  it('should render first tab content by default', () => {
    render(<TabLayout tabPanels={tabPanels} />)

    expect(screen.getByText('Offres disponibles content')).toBeOnTheScreen()
  })

  it('should render second tab content when clicking on the second tab title', () => {
    render(<TabLayout tabPanels={tabPanels} />)

    fireEvent.press(screen.getByText('Infos pratiques'))

    expect(screen.queryByText('Offres disponibles content')).not.toBeOnTheScreen()
    expect(screen.getByText('Infos pratiques content')).toBeOnTheScreen()
  })
})
