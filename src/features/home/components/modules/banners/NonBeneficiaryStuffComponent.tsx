import React from 'react'
import styled from 'styled-components/native'

import { BookingsResponse, SubcategoryIdEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { OnGoingBookingItem } from 'features/bookings/components/OnGoingBookingItem'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { Separator } from 'ui/components/Separator'
import { BicolorInfo } from 'ui/svg/icons/BicolorInfo'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const useNonBeneficiaryStuff = () => {
  const { isLoggedIn, user } = useAuthContext()
  // const { params } = useRoute<UseRouteType<'Home'>>()
  const isDuoInvitation = true
  const isNotBeneficiary = isLoggedIn && !user?.isBeneficiary

  const allowedToShow = isNotBeneficiary || isDuoInvitation

  return [isDuoInvitation, allowedToShow] as const
}

export const NonBeneficiaryStuffComponent = () => {
  const [isDuoInvitation, allowedToShow] = useNonBeneficiaryStuff()

  if (!allowedToShow) return null

  return (
    <DefaultContainer>
      {isDuoInvitation ? (
        <React.Fragment>
          <Typo.Title3>Réservations DUO à venir</Typo.Title3>
          <Spacer.Column numberOfSpaces={4} />
          <OnGoingBookingItem booking={bookingFixture} />
          <Spacer.Column numberOfSpaces={4} />
          <Separator.Horizontal />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      ) : null}

      <InfoBanner
        message="Le pass, c’est pour tout le monde&nbsp;! Découvre les propositions culturelles de ta région"
        icon={BicolorInfo}
      />
      <Spacer.Column numberOfSpaces={6} />
    </DefaultContainer>
  )
}

const DefaultContainer = styled.View(({ theme }) => ({
  paddingHorizontal: getSpacing(6),
  maxWidth: theme.appContentWidth,
  width: '100%',
  alignSelf: 'center',
}))

/*
user.743@passculture.gen
r@cs$rL4Q9Xu@pc
*/

export const bookingFixture: BookingsResponse['ongoing_bookings'][0] = {
  id: 1163,
  cancellationDate: null,
  cancellationReason: null,
  confirmationDate: '2024-09-25T13:09:35.326602Z',
  completedUrl: null,
  dateCreated: '2024-09-25T13:09:35.326602Z',
  dateUsed: null,
  expirationDate: null,
  qrCodeData: 'PASSCULTURE:v3;TOKEN:HATLVF',
  quantity: 2,
  stock: {
    id: 8543,
    beginningDatetime: '2024-09-25T18:30:00Z',
    features: ['VF'],
    offer: {
      id: 2311,
      bookingContact: null,
      name: 'Le Comte de Monte-Cristo',
      extraData: {
        ean: null,
      },
      image: {
        url: 'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/AT2Q',
        credit: null,
      },
      isDigital: false,
      isPermanent: false,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      url: null,
      venue: {
        id: 14,
        address: 'Place de la Porte Maillot',
        postalCode: '75017',
        city: 'Paris',
        name: 'UGC MAILLOT',
        publicName: 'UGC MAILLOT',
        coordinates: {
          latitude: 48.87882,
          longitude: 2.28317,
        },
        timezone: 'Europe/Paris',
      },
      withdrawalDetails: null,
      withdrawalType: null,
      withdrawalDelay: null,
    },
    price: 570,
    priceCategoryLabel: 'Tarif unique',
  },
  totalAmount: 1140,
  token: 'HATLVF',
  userReaction: null,
  activationCode: null,
  externalBookings: [],
}
