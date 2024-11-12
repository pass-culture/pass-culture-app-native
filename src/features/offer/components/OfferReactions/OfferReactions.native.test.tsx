import React from 'react'

import { OfferResponseV2, ReactionTypeEnum } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { OfferReactions } from 'features/offer/components/OfferReactions/OfferReactions'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser, mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('features/auth/context/AuthContext')

const mockBookings = { ...bookingsSnap }
const mockUseBookings = jest.fn(() => ({
  data: mockBookings,
}))
jest.mock('features/bookings/api/useBookings', () => ({
  useBookings: jest.fn(() => mockUseBookings()),
}))

it('should display "Sois le premier à réagir :" when there are no likes and the user is connected, beneficiary and has possibility to react', async () => {
  const offerWithoutLikes: OfferResponseV2 = {
    ...offerResponseSnap,
    reactionsCount: { likes: 0 },
  }

  mockAuthContextWithUser(beneficiaryUser, { persist: true })
  render(
    <OfferReactions isLoggedIn user={beneficiaryUser} offer={offerWithoutLikes} userCanReact />
  )

  expect(await screen.findByText('Sois le premier à réagir :')).toBeOnTheScreen()
})

it('should display "Aimé par 1 jeune" when there is 1 like and the user is connected and beneficiary', async () => {
  const offerWithOneLike = {
    ...offerResponseSnap,
    reactionsCount: { likes: 1 },
  }

  mockAuthContextWithUser(beneficiaryUser, { persist: true })
  render(<OfferReactions isLoggedIn user={beneficiaryUser} offer={offerWithOneLike} />)

  expect(await screen.findByText('Aimé par 1 jeune')).toBeOnTheScreen()
})

it('should display "Aimé par X jeunes" when there are multiple likes and the user is connected and beneficiary', async () => {
  const offerWithMultipleLikes = {
    ...offerResponseSnap,
    reactionsCount: { likes: 3 },
  }

  mockAuthContextWithUser(beneficiaryUser, { persist: true })
  render(<OfferReactions isLoggedIn user={beneficiaryUser} offer={offerWithMultipleLikes} />)

  expect(await screen.findByText('Aimé par 3 jeunes')).toBeOnTheScreen()
})

it('should display "Aimé par X jeunes" when the user is not connected', async () => {
  const offerWithLikes = {
    ...offerResponseSnap,
    reactionsCount: { likes: 2 },
  }

  mockAuthContextWithoutUser()

  render(<OfferReactions isLoggedIn={false} user={undefined} offer={offerWithLikes} />)

  expect(screen.queryByText('Sois le premier à réagir :')).not.toBeOnTheScreen()
  expect(await screen.findByText('Aimé par 2 jeunes')).toBeOnTheScreen()
})

it('should display "Aimé par X jeunes" when the user is not beneficiary', async () => {
  const offerWithLikes = {
    ...offerResponseSnap,
    reactionsCount: { likes: 2 },
  }

  mockAuthContextWithUser(nonBeneficiaryUser, { persist: true })

  render(<OfferReactions isLoggedIn={false} user={undefined} offer={offerWithLikes} />)

  expect(screen.queryByText('Sois le premier à réagir :')).not.toBeOnTheScreen()
  expect(await screen.findByText('Aimé par 2 jeunes')).toBeOnTheScreen()
})

it('should display nothing when the user is not connected', async () => {
  const offerWithLikes = {
    ...offerResponseSnap,
    reactionsCount: { likes: 0 },
  }

  mockAuthContextWithoutUser()
  render(<OfferReactions isLoggedIn user={nonBeneficiaryUser} offer={offerWithLikes} />)

  expect(screen.queryByText('Sois le premier à réagir :')).not.toBeOnTheScreen()
  expect(screen.queryByText(/Aimé par/)).not.toBeOnTheScreen()
})

it('should display nothing when the user is not a beneficiary', async () => {
  const offerWithLikes = {
    ...offerResponseSnap,
    reactionsCount: { likes: 0 },
  }

  mockAuthContextWithUser(nonBeneficiaryUser, { persist: true })
  render(<OfferReactions isLoggedIn user={nonBeneficiaryUser} offer={offerWithLikes} />)

  expect(screen.queryByText('Sois le premier à réagir :')).not.toBeOnTheScreen()
  expect(screen.queryByText(/Aimé par/)).not.toBeOnTheScreen()
})

it('should display nothing when there are no likes and the user is connected, beneficiary and has not possibility to react', async () => {
  const offerWithoutLikes: OfferResponseV2 = {
    ...offerResponseSnap,
    reactionsCount: { likes: 0 },
  }

  mockAuthContextWithUser(beneficiaryUser, { persist: true })
  render(<OfferReactions isLoggedIn user={beneficiaryUser} offer={offerWithoutLikes} />)

  expect(screen.queryByText('Sois le premier à réagir :')).not.toBeOnTheScreen()
  expect(screen.queryByText(/Aimé par/)).not.toBeOnTheScreen()
})

it('should display nothing when the user is connected, beneficiary, has possibility to react, has disliked and there are no likes', async () => {
  const offerWithoutLikes: OfferResponseV2 = {
    ...offerResponseSnap,
    reactionsCount: { likes: 0 },
  }
  const userBooking = { ...bookingsSnap.ended_bookings[0], userReaction: ReactionTypeEnum.DISLIKE }

  mockAuthContextWithUser(beneficiaryUser, { persist: true })
  render(
    <OfferReactions
      isLoggedIn
      user={beneficiaryUser}
      offer={offerWithoutLikes}
      userBooking={userBooking}
      userCanReact
    />
  )

  expect(screen.queryByText('Sois le premier à réagir :')).not.toBeOnTheScreen()
  expect(screen.queryByText(/Aimé par/)).not.toBeOnTheScreen()
})
