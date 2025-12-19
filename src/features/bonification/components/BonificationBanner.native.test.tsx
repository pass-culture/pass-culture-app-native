import React from 'react'

import { QFBonificationStatus } from 'api/gen'
import { BonificationBanner } from 'features/bonification/components/BonificationBanner'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('BonificationBanner', () => {
  it('should show default banner', () => {
    render(
      reactQueryProviderHOC(
        <BonificationBanner
          bonificationStatus={QFBonificationStatus.eligible}
          onCloseCallback={jest.fn()}
        />
      )
    )

    const bannerLabel = screen.getByText(
      'Un bonus de 50 € pourrait t’être attribué, voyons si tu peux y être éligible.'
    )

    expect(bannerLabel).toBeOnTheScreen()
  })

  it('should show error banner', () => {
    render(
      reactQueryProviderHOC(
        <BonificationBanner
          bonificationStatus={QFBonificationStatus.unknown_ko}
          onCloseCallback={jest.fn()}
        />
      )
    )

    const bannerLabel = screen.getByText(
      'Nous n’avons pas trouvé de correspondance pour ce dossier.'
    )

    expect(bannerLabel).toBeOnTheScreen()
  })

  it('should show pending banner', () => {
    render(
      reactQueryProviderHOC(
        <BonificationBanner
          bonificationStatus={QFBonificationStatus.started}
          onCloseCallback={jest.fn()}
        />
      )
    )

    const bannerLabel = screen.getByText(
      'Dossier en cours de vérification. On te notifiera rapidement.'
    )

    expect(bannerLabel).toBeOnTheScreen()
  })
})
