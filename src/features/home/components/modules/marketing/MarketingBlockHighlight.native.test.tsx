import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CategoryIdEnum } from 'api/gen'
import { render, screen, fireEvent } from 'tests/utils'

import { MarketingBlockHighlight } from './MarketingBlockHighlight'

const props = {
  title: 'Harry Potter et l’Ordre du Phénix',
  homeId: 'fakeEntryId',
  moduleId: 'fakeModuleId',
  backgroundImageUrl: 'url',
  categoryText: 'Cinéma',
  date: 'Du 12/06 au 24/06',
  categoryId: CategoryIdEnum.FILM,
}

describe('MarketingBlockHighlight', () => {
  it('should display correct accessibility label', () => {
    render(<MarketingBlockHighlight {...props} />)

    const accessibilityLabel = screen.getByLabelText(
      'Découvre le temps fort "Harry Potter et l’Ordre du Phénix" de la catégorie "Cinéma" Du 12/06 au 24/06.'
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
