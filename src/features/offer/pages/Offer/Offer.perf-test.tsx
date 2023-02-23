import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { measurePerformance } from 'reassure'
import { ThemeProvider } from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as InstalledAppsCheck from 'features/offer/helpers/checkInstalledApps/checkInstalledApps'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { computedTheme } from 'tests/computedTheme'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { waitFor } from 'tests/utils'
import { Network } from 'ui/components/ShareMessagingApp'

const mockedOffer: Partial<OfferResponse> | undefined = offerResponseSnap
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => ({
    data: mockedOffer,
  }),
}))

const mockSubcategories = placeholderData.subcategories
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
    },
  }),
}))

const mockCheckInstalledApps = jest.spyOn(InstalledAppsCheck, 'checkInstalledApps') as jest.Mock
mockCheckInstalledApps.mockResolvedValue({
  [Network.snapchat]: true,
})

test('Simple test', async () => {
  await waitFor(async () => {
    await measurePerformance(<Offer />, {
      wrapper: (children) =>
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        reactQueryProviderHOC(<ThemeProvider theme={computedTheme}>{children}</ThemeProvider>),
    })
  })
})
