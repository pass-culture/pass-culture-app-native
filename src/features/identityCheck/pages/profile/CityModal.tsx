import { t } from '@lingui/macro'
import debounce from 'lodash.debounce'
import React, { useRef, useState } from 'react'
import RNModal from 'react-native-modal'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { RadioButton } from 'features/identityCheck/atoms/form/RadioButton'
import { SuggestedCity } from 'libs/place'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Style } from 'ui/components/Style'
import { BicolorBuilding } from 'ui/svg/icons/BicolorBuilding'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  cities?: SuggestedCity[]
  onSubmit: (city: SuggestedCity) => void
  isVisible: boolean
  close?: () => void
}

const defaultProps = {
  cities: [],
  isVisible: false,
  close: () => null,
}

const webcss = `div[aria-modal="true"] { align-items: center }`

export const CityModal = ({ cities, onSubmit, isVisible, close }: Props) => {
  const { top, bottom } = useSafeAreaInsets()
  const [selectedCity, setSelectedCity] = useState<string | undefined>()
  const debouncedOnSubmit = useRef(debounce(onSubmit, 1000)).current

  const onSubmitSelectedCity = (city: SuggestedCity) => {
    setSelectedCity(city.name)
    debouncedOnSubmit(city)
  }

  return (
    <React.Fragment>
      <Style>{webcss}</Style>
      <StyledModal isVisible={isVisible} onClose={close} safeAreaTop={top} safeAreaBottom={bottom}>
        <HeaderContainer>
          <BicolorBuilding size={getSpacing(24)} />
          <Spacer.Column numberOfSpaces={6} />
          <Typo.Title4>{t`Dans quelle ville résides-tu ?`}</Typo.Title4>
          <Spacer.Column numberOfSpaces={4} />
          <StyledBody>
            {t`Plusieurs villes sont associées à ce code postal, sélectionne la tienne.`}
          </StyledBody>
        </HeaderContainer>
        <Container>
          <StyledScrollView>
            {cities?.map((city) => (
              <RadioButton
                key={city.name}
                name={city.name}
                onPress={() => onSubmitSelectedCity(city)}
                selected={city.name === selectedCity}
              />
            ))}
          </StyledScrollView>
          <BottomContainer>
            <ButtonTertiaryBlack title={t`Annuler`} onPress={close} icon={Invalidate} />
          </BottomContainer>
        </Container>
      </StyledModal>
    </React.Fragment>
  )
}

CityModal.defaultProps = defaultProps

// @ts-ignore RNModal extends React.Component
const StyledModal = styled(RNModal)<{ safeAreaTop: number }>(
  ({ theme, safeAreaTop, safeAreaBottom }) => ({
    backgroundColor: theme.colors.white,
    maxWidth: getSpacing(125),
    borderRadius: getSpacing(4),
    flex: 1,
    ...(!!theme.isMobileViewport && {
      marginTop: getSpacing(5) + safeAreaTop,
      marginBottom: getSpacing(10) + safeAreaBottom,
    }),
  })
)

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

const StyledScrollView = styled.ScrollView({
  flex: 1,
})

const BottomContainer = styled.View({
  alignItems: 'center',
  width: '100%',
  paddingTop: getSpacing(3),
  paddingBottom: getSpacing(7),
})
