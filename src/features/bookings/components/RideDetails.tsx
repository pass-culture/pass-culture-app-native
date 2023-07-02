import { useNavigation } from '@react-navigation/native'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import React, { useMemo, useState } from 'react'
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

export function RideDetails({ title, onClosePress, onEndReached }: RideDetailsProps) {
  const [showModal, setShowModal] = useState(true)
  const { goBack } = useNavigation<UseNavigationType>()

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

  const backHandler = () => {
    setShowModal(false)
    goBack()
  }

  return (
    <View style={{ flex: 1 }}>
      <PageHeaderSecondary onGoBack={goBack} title="Trajet terminé" />
      <MainContainer>
        <StyledImage
          source={require('./../components/assets/Images/done.png')}
          resizeMode="contain"
        />
        {customHeader}
        <Spacer.Column numberOfSpaces={4} />

        <DetailsContainer>
          <DetailTitleContainer>
            <Typo.Title4>{'Montant total'}</Typo.Title4>
            <Typo.Title4>
              {'€ '}
              {'18'}
            </Typo.Title4>
          </DetailTitleContainer>
          <Spacer.Column numberOfSpaces={5} />
          <Separator />
          <Spacer.Column numberOfSpaces={4} />
          <HoriZontalContainer>
            <DatetimeText>{'Wed, 8th Nov'}</DatetimeText>
            <Spacer.Row numberOfSpaces={2} />
            <Dot size={4} fillColor={ColorsEnum.GREY_MEDIUM} />
            <Spacer.Row numberOfSpaces={2} />
            <DatetimeText>{'7:52 PM'}</DatetimeText>
          </HoriZontalContainer>
          <Spacer.Column numberOfSpaces={3} />

          <LocationContainer>
            <StyledLocationIcon
              resizeMode="contain"
              source={require('./../components/assets/Icons/ic_pickup.png')}
            />
            <Spacer.Row numberOfSpaces={1} />
            <LocationLabelContainer>
              <DateLabel>{'Musée Zadkin'}</DateLabel>
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
              <DateLabel>{'Louvre Museum'}</DateLabel>
              <AddressText>{'Paris, France'}</AddressText>
            </LocationLabelContainer>
          </LocationContainer>
        </DetailsContainer>
        <Spacer.Column numberOfSpaces={10} />
      </MainContainer>

      {/* </AppModal> */}
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
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: getSpacing(10),
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
  paddingVertical: 24,
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
