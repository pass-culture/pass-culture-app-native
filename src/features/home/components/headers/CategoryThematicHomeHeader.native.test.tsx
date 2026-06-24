import React from 'react'

import { CategoryThematicHomeHeader } from 'features/home/components/headers/CategoryThematicHomeHeader'
import { Color } from 'features/home/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/home/components/SubscribeButtonWithModals', () => ({
  SubscribeButtonWithModals: () => null,
}))

describe('CategoryThematicHomeHeader', () => {
  it('should show title and subtitle if render correctly', async () => {
    render(
      reactQueryProviderHOC(
        <CategoryThematicHomeHeader
          homeId="fakeEntryId"
          imageUrl="https://example.com/show.png"
          subtitle="Un sous-titre"
          title="Un titre"
          color={Color.Aquamarine}
        />
      )
    )

    expect(await screen.findByText('Un titre')).toBeOnTheScreen()
    expect(screen.getByText('Un sous-titre')).toBeOnTheScreen()
    expect(screen.getByTestId('categoryHeaderIllustration')).toBeOnTheScreen()
  })

  it('should show each title part in a separate label', async () => {
    render(
      reactQueryProviderHOC(
        <CategoryThematicHomeHeader
          homeId="fakeEntryId"
          imageUrl="https://example.com/show.png"
          title="Vos recommandations"
          titleParts={['Vos', 'recommandations']}
          color={Color.Aquamarine}
        />
      )
    )

    expect(await screen.findByText('Vos')).toBeOnTheScreen()
    expect(screen.getByText('recommandations')).toBeOnTheScreen()
    expect(screen.queryByText('Vos recommandations')).not.toBeOnTheScreen()
  })
})
