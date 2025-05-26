import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { render, screen, userEvent } from 'tests/utils'

import { MarketingBlockHighlight, MarketingBlockHighlightProps } from './MarketingBlockHighlight'

const props: MarketingBlockHighlightProps = {
  title: 'Harry Potter et l’Ordre du Phénix',
  homeId: 'fakeEntryId',
  moduleId: 'fakeModuleId',
  backgroundImageUrl: 'url',
  label: 'Cinéma',
  subtitle: 'Du 12/06 au 24/06',
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('MarketingBlockHighlight', () => {
  it('navigate to highlight thematic home when pressing', async () => {
    render(<MarketingBlockHighlight {...props} />)

    const titlelink = screen.getByText('Harry Potter et l’Ordre du Phénix')
    await user.press(titlelink)

    expect(navigate).toHaveBeenNthCalledWith(1, 'ThematicHome', {
      homeId: 'fakeEntryId',
      from: 'highlight_thematic_block',
      moduleId: 'fakeModuleId',
    })
  })
})
