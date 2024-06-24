import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { render, screen, fireEvent } from 'tests/utils'

import { MarketingBlockHighlight, MarketingBlockHighlightProps } from './MarketingBlockHighlight'

const props: MarketingBlockHighlightProps = {
  title: 'Harry Potter et l’Ordre du Phénix',
  homeId: 'fakeEntryId',
  moduleId: 'fakeModuleId',
  backgroundImageUrl: 'url',
  label: 'Cinéma',
  subtitle: 'Du 12/06 au 24/06',
}

describe('MarketingBlockHighlight', () => {
  it('should display correct accessibility label', () => {
    render(<MarketingBlockHighlight {...props} />)

    const accessibilityLabel = screen.getByLabelText(
      'Découvre le temps fort "Harry Potter et l’Ordre du Phénix" Du 12/06 au 24/06.'
    )

    expect(accessibilityLabel).toBeTruthy()
  })

  it('navigate to highlight thematic home when pressing', () => {
    render(<MarketingBlockHighlight {...props} />)

    const titlelink = screen.getByText('Harry Potter et l’Ordre du Phénix')
    fireEvent.press(titlelink)

    expect(navigate).toHaveBeenNthCalledWith(1, 'ThematicHome', {
      homeId: 'fakeEntryId',
      from: 'highlight_thematic_block',
      moduleId: 'fakeModuleId',
    })
  })
})
