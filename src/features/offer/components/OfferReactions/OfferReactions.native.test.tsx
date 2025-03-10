import React from 'react'

import { OfferResponseV2 } from 'api/gen'
import { OfferReactions } from 'features/offer/components/OfferReactions/OfferReactions'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('libs/firebase/analytics/analytics')

it('should display "1 j’aime" when there is 1 like', async () => {
  const offerWithOneLike = {
    ...offerResponseSnap,
    reactionsCount: { likes: 1 },
  }
  render(<OfferReactions offer={offerWithOneLike} />)

  expect(await screen.findByText('1 j’aime')).toBeOnTheScreen()
  expect(screen.getByTestId('thumbUp')).toBeOnTheScreen()
})

it('should display nothing when there are no likes', async () => {
  const offerWithoutLikes: OfferResponseV2 = {
    ...offerResponseSnap,
    reactionsCount: { likes: 0 },
  }

  render(<OfferReactions offer={offerWithoutLikes} />)

  expect(screen.queryByTestId('thumbUp')).not.toBeOnTheScreen()
})
