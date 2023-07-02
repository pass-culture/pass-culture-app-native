import { useNavigation } from '@react-navigation/native'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import React, { useEffect, useMemo, useState } from 'react'
import { Image, View } from 'react-native'
import styled from 'styled-components/native'
import { Separator } from 'ui/components/Separator'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { AppModal } from 'ui/components/modals/AppModal'
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
  const [showModal, setShowModal] = useState(true)
  const { goBack } = useNavigation<UseNavigationType>()

  console.log('routes--------------------- ', rideData)
  const [rideDetail, setRideDeatails] = useState('')

  useEffect(() => {
    setRideDeatails(rideData.booking)
  }, [rideData])

  const customHeader = useMemo(() => {
    return (
      <ModalHeaderContainer>
        <View>
          <View style={{ height: HEIGHT_CONTAINER, alignContent: 'center' }} />
          <Typo.Title3 style={{ textAlign: 'center' }}> {'Trajet terminé'} </Typo.Title3>
          <Spacer.Column numberOfSpaces={3} />
          <HeaderMessage>
            {`Nous espérons que votre trajet s'est déroulé sans encombre`}
          </HeaderMessage>
        </View>
      </ModalHeaderContainer>
    )
  }, [])

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
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
        {/* <StyledImage
          source={require('./../components/assets/Images/done.png')}
          resizeMode="contain"
        /> */}
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
          <Spacer.Column numberOfSpaces={2} />

          <RideIDText>{`Ride ID : ${rideDetail?.reservationid}`}</RideIDText>
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
              <DateLabel>{rideDetail.source.name}</DateLabel>
              <AddressText>{'Paris, France'}</AddressText>
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
              <DateLabel>{rideDetail.destination.name}</DateLabel>
              <AddressText>{'Paris, France'}</AddressText>
            </LocationLabelContainer>
          </LocationContainer>
        </DetailsContainer>
        <Spacer.Column numberOfSpaces={10} />
      </MainContainer>
    </View>
  )
}

const HeaderMessage = styled.Text({
  textAlign: 'center',
  fontSize: 12,
  fontFamily: 'Montserrat',
  fontStyle: 'normal',
  fontWeight: '400',
  color: ColorsEnum.GREY,
  lineHeight: 18,
})
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
  paddingHorizontal: getSpacing(6),
})

const DetailsContainer = styled.View({
  width: '100%',
  borderWidth: 1,
  borderRadius: 8,
  borderColor: ColorsEnum.GREY_LIGHT,
  height: 230,
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
