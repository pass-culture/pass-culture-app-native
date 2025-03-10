import React from 'react'

import { OfferResponseV2 } from 'api/gen'
import { OfferReactions } from 'features/offer/components/OfferReactions/OfferReactions'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('libs/firebase/analytics/analytics')

it('should display likes information when exists', async () => {
  const offerWithOneLike = {
    ...offerResponseSnap,
    reactionsCount: { likes: 1 },
  }
  render(<OfferReactions offer={offerWithOneLike} />)

  expect(await screen.findByText('1 j’aime')).toBeOnTheScreen()
  expect(screen.getByTestId('thumbUp')).toBeOnTheScreen()
})

it('should not display likes information when not exists', async () => {
  const offerWithoutLikes: OfferResponseV2 = {
    ...offerResponseSnap,
    reactionsCount: { likes: 0 },
  }

  render(<OfferReactions offer={offerWithoutLikes} />)

  expect(screen.queryByTestId('thumbUp')).not.toBeOnTheScreen()
})

it('should display chronicles information when exist', async () => {
  render(<OfferReactions offer={offerResponseSnap} />)

  expect(await screen.findByText('3 avis')).toBeOnTheScreen()
  expect(screen.getByTestId('bookClubCertification')).toBeOnTheScreen()
})

it('should not display chronicles information when not exists', async () => {
  const offerWithoutLikes: OfferResponseV2 = {
    ...offerResponseSnap,
    chronicles: [],
  }

  render(<OfferReactions offer={offerWithoutLikes} />)

  expect(screen.queryByTestId('bookClubCertification')).not.toBeOnTheScreen()
})

it('should display nothing when there are not chronicles and likes information', async () => {
  const offerWithoutLikesAndChronicles: OfferResponseV2 = {
    ...offerResponseSnap,
    reactionsCount: { likes: 0 },
    chronicles: [],
  }

  render(<OfferReactions offer={offerWithoutLikesAndChronicles} />)

  expect(screen.queryByTestId('bookClubCertification')).not.toBeOnTheScreen()
  expect(screen.queryByTestId('thumbUp')).not.toBeOnTheScreen()
})
