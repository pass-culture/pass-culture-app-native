import { useNavigation } from '@react-navigation/native'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment'
import React, { useEffect, useMemo, useState } from 'react'
import { Image, View } from 'react-native'
import styled from 'styled-components/native'
import { Separator } from 'ui/components/Separator'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Dot } from 'ui/svg/icons/Dot'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { ColorsEnum } from 'ui/theme/colors'

const HEIGHT_CONTAINER = getSpacing(6)

interface RideDetailsProps {
  title: string
  onClosePress: () => void
  onEndReached: () => void
}

export function RideDetails({ route }) {
  const rideData = route.params
  const { goBack } = useNavigation<UseNavigationType>()

  const [rideDetail, setRideDeatails] = useState('')
  const [picupAddress, setPicupAddress] = useState('')
  const [dropAddress, setDropAddress] = useState('')

  const getPlace = async (lat, long) => {
    const mapUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat || 48.8566},${
      long || 2.3522
    }&sensor=true&key=${env.GOOGLE_MAP_API_KEY}`

    try {
      const response = await fetch(mapUrl)
      const data = await response.json()

      const results = data.results
      if (results.length > 0) {
        const addressComponents = results[0].address_components
        const city = addressComponents.find((component) =>
          component.types.includes('locality')
        ).long_name
        const country = addressComponents.find((component) =>
          component.types.includes('country')
        ).long_name
        const place = `${city}, ${country}`
        return place
      }
    } catch (error) {
      console.error('Error fetching place:', error)
    }
  }

  useEffect(() => {
    setRideDeatails(rideData.booking)

    // Fetch the pickup address and update the state
    const fetchPickupAddress = async () => {
      try {
        const pickupPlace = await getPlace(
          rideData.booking.source.latitude,
          rideData.booking.source.longitude
        )
        setPicupAddress(pickupPlace)
        const dropPlace = await getPlace(
          rideData.booking.source.latitude,
          rideData.booking.source.longitude
        )
        setDropAddress(dropPlace)
      } catch (error) {
        console.error('Error fetching pickup address:', error)
      }
    }

    fetchPickupAddress()
  }, [rideData])
  const customHeader = useMemo(() => {
    return (
      <ModalHeaderContainer>
        <HeaderContainer>
          <Typo.Title3>{'Trajet en taxis terminé'} </Typo.Title3>
          <RideIDText>{`ID de voyage : ${rideDetail?.reservationid}`}</RideIDText>
        </HeaderContainer>
      </ModalHeaderContainer>
    )
  }, [rideDetail])

  function formatDateToCustomString(dateStr) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]

    const date = new Date(dateStr)
    const dayOfWeek = getShortDayOfWeek(date)
    const day = date.getUTCDate()
    const month = months[date.getUTCMonth()]

    const suffix = getDaySuffix(day)
    return `${dayOfWeek}, ${day}${suffix} ${month}`
  }

  function getShortDayOfWeek(date) {
    const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    return daysOfWeek[date.getUTCDay()]
  }

  function getTimeIn12HourFormat(dateStr) {
    const date = new Date(dateStr)
    let hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()
    const period = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12
    const formattedHours = hours.toString().padStart(2, '0')
    const formattedMinutes = minutes.toString().padStart(2, '0')
    return `${formattedHours}:${formattedMinutes} ${period}`
  }

  function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
      return 'th'
    } else {
      switch (day % 10) {
        case 1:
          return 'st'
        case 2:
          return 'nd'
        case 3:
          return 'rd'
        default:
          return 'th'
      }
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <PageHeaderSecondary onGoBack={goBack} title="Trajet terminé" />
      <MainContainer>
        {customHeader}
        <Spacer.Column numberOfSpaces={4} />

        <DetailsContainer>
          <DetailTitleContainer>
            <Typo.Title4>{'Montant total'}</Typo.Title4>
            <Typo.Title4>
              {'€ '}
              {rideDetail?.tripamount}
            </Typo.Title4>
          </DetailTitleContainer>
          <Spacer.Column numberOfSpaces={3} />
          <Separator />
          <Spacer.Column numberOfSpaces={4} />
          <HoriZontalContainer>
            <DatetimeText>{formatDateToCustomString(rideDetail?.tripdate)}</DatetimeText>
            <Spacer.Row numberOfSpaces={2} />
            <Dot size={4} fillColor={ColorsEnum.GREY_MEDIUM} />
            <Spacer.Row numberOfSpaces={2} />
            <DatetimeText>{getTimeIn12HourFormat(rideDetail?.tripdate)}</DatetimeText>
          </HoriZontalContainer>
          <Spacer.Column numberOfSpaces={3} />

          <LocationContainer>
            <StyledLocationIcon
              resizeMode="contain"
              source={require('./../components/assets/Icons/ic_pickup.png')}
            />
            <Spacer.Row numberOfSpaces={1} />
            <LocationLabelContainer>
              <DateLabel>{rideDetail?.source?.name}</DateLabel>
              <AddressText>{picupAddress}</AddressText>
            </LocationLabelContainer>
          </LocationContainer>
          <DotCoontainer>
            <Dot size={2} fillColor={ColorsEnum.GREY_MEDIUM} />
            <Dot size={2} fillColor={ColorsEnum.GREY_MEDIUM} />
            <Dot size={2} fillColor={ColorsEnum.GREY_MEDIUM} />
            <Dot size={2} fillColor={ColorsEnum.GREY_MEDIUM} />
            <Dot size={2} fillColor={ColorsEnum.GREY_MEDIUM} />
          </DotCoontainer>
          <LocationContainer>
            <StyledLocationIcon
              resizeMode="contain"
              source={require('./../components/assets/Icons/ic_drop.png')}
            />
            <Spacer.Row numberOfSpaces={1} />
            <LocationLabelContainer>
              <DateLabel>{rideDetail?.destination?.name}</DateLabel>
              <AddressText>{'Paris, France'}</AddressText>
            </LocationLabelContainer>
          </LocationContainer>
        </DetailsContainer>
        <Spacer.Column numberOfSpaces={10} />
      </MainContainer>
    </View>
  )
}

const RideIDText = styled.Text({
  fontSize: 12,
  fontFamily: 'Montserrat',
  fontStyle: 'normal',
  fontWeight: '400',
  color: ColorsEnum.GREY,
  lineHeight: 18,
})
const StyledImage = styled.Image(({ theme, size }: any) => ({
  height: 160,
}))
const LocationLabelContainer = styled.View({
  width: '100%',
  paddingHorizontal: getSpacing(2),
})

const MainContainer = styled.View({
  // width: '100%',
  flex: 1,
  // justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: getSpacing(9),
  marginTop: getSpacing(10),
})

const ModalHeaderContainer = styled.View({
  width: '100%',
  paddingHorizontal: getSpacing(2),
})

const HeaderContainer = styled.View({
  paddingHorizontal: getSpacing(0),
})
const DetailsContainer = styled.View({
  width: '100%',
  borderWidth: 1,
  borderRadius: 8,
  borderColor: ColorsEnum.GREY_LIGHT,
  height: 240,
  paddingHorizontal: 16,
  paddingTop: 24,
  paddingBottom: 24,
})
const DetailTitleContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const HoriZontalContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const DatetimeText = styled.Text({
  color: '#454545',
  fontSize: 14,
  fontFamily: 'Montserrat',
  fontStyle: 'normal',
  fontWeight: '500',
  lineHeight: 18,
})
const StyledLocationIcon = styled(Image)({
  height: 14,
  width: 12,
})

const LocationContainer = styled.View({
  //   flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})
const DotCoontainer = styled.View({
  flex: 1,
  width: 11,
  marginVertical: -10,
  alignItems: 'center',
  justifyContent: 'space-around',
})
const DateLabel = styled(Typo.Body)(({ theme }) => ({
  color: ColorsEnum.GREY_DARK,
  fontSize: 12,
  fontFamily: 'Plus Jakarta Sans',
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: 16,
}))
const AddressText = styled(Typo.Body)(({ theme }) => ({
  color: ColorsEnum.GREY_SEMI_DARK,
  fontSize: 12,
  fontFamily: 'Plus Jakarta Sans',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: 16,
}))
