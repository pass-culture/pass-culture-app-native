import { t } from '@lingui/macro'
import React, { useState } from 'react'
import { LayoutChangeEvent, Platform } from 'react-native'
import RNModal from 'react-native-modal'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { RadioButton } from 'ui/components/RadioButton'
import { Style } from 'ui/components/Style'
import { BicolorLocationBuilding } from 'ui/svg/icons/BicolorLocationBuilding'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export interface City {
  name: string
  code: string
  postalCode: string
}

interface Props {
  cities?: City[]
  onSubmit: (city: City) => City
  isVisible: boolean
}

const defaultProps = {
  cities: [],
  isVisible: false,
}

export const CityModal = ({ cities, onSubmit, isVisible }: Props) => {
  const [bottomContainerHeight, setBottomContainerHeight] = useState(0)
  function onLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout
    setBottomContainerHeight(height)
  }

  const onClose = () => 'close'

  const webcss = `div[aria-modal="true"] { align-items: center }`

  return (
    <React.Fragment>
      <Style>{webcss}</Style>
      <StyledModal isVisible={isVisible} onBackdropPress={onClose}>
        <HeaderContainer>
          <BicolorLocationBuilding size={getSpacing(40)} />
          <Typo.Title4>{t`Dans quelle ville résides-tu ?`}</Typo.Title4>
          <Spacer.Column numberOfSpaces={4} />
          <StyledBody>
            {t`Plusieurs villes sont associées à ce code postal, sélectionne la tienne.`}
          </StyledBody>
        </HeaderContainer>
        <Container>
          <StyledScrollView bottomContainerHeight={bottomContainerHeight}>
            {cities?.map((city) => (
              <RadioButton
                key={city.name}
                id={city.code}
                title={city.name}
                onSelect={() => onSubmit(city)}
                selectedValue={city.name}
              />
            ))}
          </StyledScrollView>
          <BottomContainer onLayout={onLayout} testID="bottom-container">
            <ButtonPrimary title="Annuler" onPress={onClose} />
          </BottomContainer>
        </Container>
      </StyledModal>
    </React.Fragment>
  )
}

CityModal.defaultProps = defaultProps

// @ts-ignore RNModal extends React.Component
const StyledModal = styled(RNModal)(({ theme }) => ({
  backgroundColor: theme.colors.white,
  maxWidth: getSpacing(125),
  borderRadius: getSpacing(4),
  flex: 1,
}))

const HeaderContainer = styled.View({
  alignItems: 'center',
  padding: getSpacing(6),
})

const Container = styled.View({
  flex: 1,
  flexDirection: 'column',
  paddingHorizontal: getSpacing(6),
})

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
  textAlign: 'center',
}))

type StyledScrollViewProps = { bottomContainerHeight: number }

const StyledScrollView = styled.ScrollView.attrs<StyledScrollViewProps>((props) => ({
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: props.bottomContainerHeight,
  },
}))<StyledScrollViewProps>({
  flex: 1,
  marginBottom: 0,
})

const paddingBottomContainer = getSpacing(12)
const BottomContainer = styled.View({
  alignItems: 'center',
  width: '100%',
  position: 'absolute',
  bottom: 0,
  paddingBottom: getSpacing(7),
  // On the web, the bottom-container width is having a left padding but full width right
  // On native, it's the opposite.
  // This is due to the different scrolls between the two platform
  ...Platform.select({
    web: {
      paddingRight: paddingBottomContainer,
    },
    default: {
      paddingLeft: paddingBottomContainer,
    },
  }),
})
