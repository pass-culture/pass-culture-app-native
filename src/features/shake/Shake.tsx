import React from 'react'
import { useEffect } from 'react'
import RNShake from 'react-native-shake'
import styled from 'styled-components/native'

import { Cards } from 'features/shake/Cards'
import { RoundedButtonLikePass } from 'features/shake/RoundedButtonLikePass'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, getSpacing } from 'ui/theme'

export const Shake = () => {
  const { showModal, hideModal, visible } = useModal(false)

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      showModal()
    })

    return () => {
      subscription.remove()
    }
  }, [showModal])

  if (!visible) {
    return (
      <Background>
        <Container>
          <ModalHeader
            title={'La sélection mystère'}
            rightIconAccessibilityLabel="Fermer la modale"
            rightIcon={Close}
            onRightIconPress={hideModal}
          />
          <Spacer.Column numberOfSpaces={10} />
          <Cards />
          <FakeCard />
          <Spacer.Column numberOfSpaces={10} />
          <ButtonContainer>
            <RoundedButtonLikePass
              iconName="close"
              onPress={hideModal}
              accessibilityLabel="Refuser l’offre"
            />
            <Spacer.Row numberOfSpaces={5} />
            <ButtonTertiaryContainer>
              <ButtonTertiaryBlack
                inline
                wording="Voir l’offre"
                onPress={hideModal}
                buttonHeight="extraSmall"
              />
            </ButtonTertiaryContainer>
            <Spacer.Row numberOfSpaces={5} />
            <RoundedButtonLikePass
              iconName="favorite"
              onPress={hideModal}
              accessibilityLabel="Mettre en favoris"
            />
          </ButtonContainer>
        </Container>
      </Background>
    )
  }
  return null
}

const Background = styled.View({
  height: '100%',
  width: '100%',
  position: 'absolute',
  backgroundColor: 'rgba(22, 22, 23, 0.48)',
  justifyContent: 'flex-end',
})

const Container = styled.View({
  height: '90%',
  width: '100%',
  backgroundColor: '#fff',
  borderRadius: getSpacing(4),
  padding: getSpacing(6),
})

const ButtonContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
})

const ButtonTertiaryContainer = styled.View(({ theme }) => ({
  justifyContent: 'center',
  border: theme.buttons.secondary.borderWidth,
  borderRadius: theme.borderRadius.button,
  paddingHorizontal: getSpacing(6),
  paddingVertical: getSpacing(2),
}))

const FakeCard = styled.View({
  height: 500,
  background: 'lightgrey',
})
