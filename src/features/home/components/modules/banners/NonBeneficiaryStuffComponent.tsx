import React, { useState } from 'react'
import { Pressable } from 'react-native'
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
  const allowedToShow = isLoggedIn && !user?.isBeneficiary
  const [toggleDuo, setToggleDuo] = useState(true)

  function onToggleDuo(): void {
    setToggleDuo((state) => !state)
  }

  return [toggleDuo, onToggleDuo, allowedToShow] as const
}

export const NonBeneficiaryStuffComponent = () => {
  const [toggleDuo, onToggleDuo, allowedToShow] = useNonBeneficiaryStuff()

  if (!allowedToShow) return null

  return (
    <DefaultContainer>
      {toggleDuo ? (
        <React.Fragment>
          <Typo.Title3>Réservations DUO à venir</Typo.Title3>
          <Spacer.Column numberOfSpaces={4} />
          <OnGoingBookingItem booking={bookingFixture} />
          <Spacer.Column numberOfSpaces={4} />
          <Separator.Horizontal />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      ) : null}

      <Pressable onPress={onToggleDuo}>
        <InfoBanner
          message="Le pass, c’est pour tout le monde&nbsp;! Découvre les propositions culturelles de ta région"
          icon={BicolorInfo}
        />
      </Pressable>
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

const bookingFixture: BookingsResponse['ongoing_bookings'][0] = {
  id: 123,
  cancellationDate: null,
  cancellationReason: null,
  confirmationDate: '2021-03-15T23:01:37.925926',
  dateCreated: '2021-02-15T23:01:37.925926',
  dateUsed: null,
  expirationDate: null,
  totalAmount: 1900,
  token: '352UW4',
  quantity: 2,
  qrCodeData: 'PASSCULTURE:v3;TOKEN:352UW4',
  stock: {
    id: 150230,
    beginningDatetime: '2021-03-15T20:00:00',
    price: 400,
    priceCategoryLabel: 'Cat 4',
    features: ['VOSTFR', '3D', 'IMAX'],
    offer: {
      id: 147874,
      bookingContact: null,
      name: 'Avez-vous déjà vu\u00a0?',
      extraData: {
        ean: '123456789',
      },
      isPermanent: false,
      isDigital: true,
      subcategoryId: SubcategoryIdEnum.EVENEMENT_PATRIMOINE,
      venue: {
        id: 2185,
        city: 'Drancy',
        name: 'Maison de la Brique',
        coordinates: {
          latitude: 48.91683,
          longitude: 2.43884,
        },
        address: '1 boulevard de la brique',
        postalCode: '93700',
        timezone: 'Europe/Paris',
      },
      withdrawalDetails: null,
    },
  },
  externalBookings: [],
}
