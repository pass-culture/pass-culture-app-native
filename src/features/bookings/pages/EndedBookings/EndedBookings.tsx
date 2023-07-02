import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import styled from 'styled-components/native'

import { useBookings } from 'features/bookings/api'
import { EndedBookingItem } from 'features/bookings/components/EndedBookingItem'
import { Booking } from 'features/bookings/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { plural } from 'libs/plural'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { EndedRideBookingItem } from 'features/bookings/components/EndedRideItem'
import { api } from 'api/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

const renderItem: ListRenderItem<Booking | RideResponseType> = ({ item }) =>
  item.reservationid ? <EndedRideBookingItem booking={item} /> : <EndedBookingItem booking={item} />
const keyExtractor: (item: Booking) => string = (item) =>
  item?.id?.toString() || item?.reservationid?.toString()

export const EndedBookings: React.FC = () => {
  const { data: bookings } = useBookings()
  const { goBack } = useGoBack(...getTabNavConfig('Bookings'))
  const [reservedRides, setReserveRides] = useState([])

  const endedBookingsCount = bookings?.ended_bookings?.length ?? 0
  const endedBookingsLabel = plural(endedBookingsCount, {
    one: '# réservation terminée',
    other: '# réservations terminées',
  })

  const getReservationsByCommonKey = async (commonKey) => {
    try {
      const reservationsJSON = await AsyncStorage.getItem('reservations')

      if (reservationsJSON !== null) {
        const reservations = JSON.parse(reservationsJSON)
        const filteredReservations = reservations.filter(
          (reservation) => reservation.commonKey === commonKey
        )

        console.log('Retrieved reservations:', filteredReservations)
        return filteredReservations
      } else {
        console.log('No reservations found.')
        return []
      }
    } catch (error) {
      console.log('Error retrieving reservations:', error)
      return []
    }
  }

  useEffect(() => {
    async function getridedata() {
      const { phoneNumber } = (await api.getnativev1me()) || '+919480081411'
      let mobile = phoneNumber?.slice(3, phoneNumber.length)

      // await storeReservation({
      //   reservationid: 5,
      //   tripid: 'dcbb7f15-49b6-4eac-90b8-4de8da9581b6',
      //   tripamount: 13,
      //   source: { lat: 13.0411, lon: 77.6622, name: 'Horamavu agara' },
      //   destination: { lat: 13.0335, lon: 77.6739, name: 'Kalkere' },
      //   tripdate: '2023-07-02T06:53:15.622Z',
      //   commonKey: mobile,
      // })

      const rideData = await getReservationsByCommonKey(mobile)
      setReserveRides(rideData)
      console.log('rideData rideData ---------------------> ', rideData)
    }
    getridedata()
  }, [])

  const ListHeaderComponent = useCallback(
    () => (
      <React.Fragment>
        <Spacer.Column numberOfSpaces={6} />
        <EndedBookingsCount>{endedBookingsLabel}</EndedBookingsCount>
      </React.Fragment>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endedBookingsCount]
  )

  return (
    <React.Fragment>
      <PageHeaderSecondary onGoBack={goBack} title="Réservations terminées" />
      <FlatList
        listAs="ul"
        itemAs="li"
        contentContainerStyle={contentContainerStyle}
        data={[...reservedRides, ...bookings?.ended_bookings] ?? []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={StyledSeparator}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
      />
    </React.Fragment>
  )
}

const EndedBookingsCount = styled(Typo.Body).attrs(getHeadingAttrs(2))(({ theme }) => ({
  color: theme.colors.greyDark,
  paddingBottom: getSpacing(5.5),
}))

const contentContainerStyle = { paddingHorizontal: getSpacing(5) }
const ListFooterComponent = () => <Spacer.Column numberOfSpaces={12} />
const StyledSeparator = styled(Separator)({ marginVertical: getSpacing(4) })
