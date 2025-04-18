import React from 'react'
import styled from 'styled-components/native'

import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { Tab } from 'features/venue/types'
import { render, screen, userEvent } from 'tests/utils'
import { Map } from 'ui/svg/icons/Map'
import { Typo } from 'ui/theme'

const ExampleText = styled(Typo.Body)``
const tabPanels = {
  [Tab.OFFERS]: <ExampleText>Offres disponibles content</ExampleText>,
  [Tab.INFOS]: <ExampleText>Infos pratiques content</ExampleText>,
}
const user = userEvent.setup()
jest.useFakeTimers()

describe('TabLayout', () => {
  it('should render first tab content by default', () => {
    render(
      <TabLayout
        tabPanels={tabPanels}
        tabs={[{ key: Tab.OFFERS }, { key: Tab.INFOS }]}
        defaultTab={Tab.OFFERS}
      />
    )

    expect(screen.getByText('Offres disponibles content')).toBeOnTheScreen()
  })

  it('should render second tab content when clicking on the second tab title', async () => {
    render(
      <TabLayout
        tabPanels={tabPanels}
        tabs={[{ key: Tab.OFFERS }, { key: Tab.INFOS }]}
        defaultTab={Tab.OFFERS}
      />
    )

    await user.press(screen.getByText('Infos pratiques'))

    expect(screen.queryByText('Offres disponibles content')).not.toBeOnTheScreen()
    expect(screen.getByText('Infos pratiques content')).toBeOnTheScreen()
  })

  it('should render an Icon on tab when is precised', () => {
    render(
      <TabLayout
        tabPanels={tabPanels}
        tabs={[{ key: Tab.OFFERS, Icon: Map }, { key: Tab.INFOS }]}
        defaultTab={Tab.OFFERS}
      />
    )

    expect(screen.getByTestId('tabIcon')).toBeOnTheScreen()
  })

  it('should update tab when default tab changed', () => {
    let mockDefaultTab = Tab.OFFERS
    render(
      <TabLayout
        tabPanels={tabPanels}
        tabs={[{ key: Tab.OFFERS }, { key: Tab.INFOS }]}
        defaultTab={mockDefaultTab}
      />
    )

    expect(screen.getByText('Offres disponibles content')).toBeOnTheScreen()

    mockDefaultTab = Tab.INFOS
    screen.rerender(
      <TabLayout
        tabPanels={tabPanels}
        tabs={[{ key: Tab.OFFERS }, { key: Tab.INFOS }]}
        defaultTab={mockDefaultTab}
      />
    )

    expect(screen.getByText('Infos pratiques content')).toBeOnTheScreen()
  })

  it('should display a pastille on tab when specified', () => {
    render(
      <TabLayout
        tabPanels={tabPanels}
        tabs={[
          { key: Tab.OFFERS, pastille: { label: '1', accessibilityLabel: '1 offre' } },
          { key: Tab.INFOS },
        ]}
        defaultTab={Tab.OFFERS}
      />
    )

    expect(screen.getByText('1')).toBeOnTheScreen()
  })

  it('should not display a pastille on tab when not specified', () => {
    render(
      <TabLayout
        tabPanels={tabPanels}
        tabs={[{ key: Tab.OFFERS }, { key: Tab.INFOS }]}
        defaultTab={Tab.OFFERS}
      />
    )

    expect(screen.queryByTestId('pastille')).toBeNull()
  })
})
