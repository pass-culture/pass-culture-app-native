import { useNavigation } from '@react-navigation/core'
import React, { useCallback } from 'react'
import { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ButtonSecondaryWhite } from 'ui/components/buttons/ButtonSecondaryWhite'
import { BackButton } from 'ui/components/headers/BackButton'
import { BackgroundBlueWithDefaultStatusBar } from 'ui/svg/BackgroundBlue'
import { Logo } from 'ui/svg/icons/Logo'
import { Spacer, Typo, getSpacing } from 'ui/theme'

export const MoodSurvey: FunctionComponent = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const theme = useTheme()

  const title = 'Bienvenue sur Pass ton Mood\u00a0!'
  const caption = 'Trouves des offres adaptées à ton humeur '

  const goToNextPage = useCallback(() => {
    navigate('MoodQuestions')
  }, [navigate])

  return (
    <React.Fragment>
      <BackgroundBlueWithDefaultStatusBar />
      <ButtonContainer>
        <BackButton color={theme.colors.white} />
      </ButtonContainer>
      <Container>
        <Body>
          <Spacer.Column numberOfSpaces={12} />
          <Logo size={156} color={theme.colors.white} />
          <Spacer.Column numberOfSpaces={8} />
          <StyledTitle>{title}</StyledTitle>
          <Spacer.Column numberOfSpaces={4} />
          <StyledCaption>{caption}</StyledCaption>
          <Spacer.Column numberOfSpaces={4} />
          <Viewed />
          <BottomButtonContainer>
            <ButtonSecondaryWhite
              wording={'Commencer'}
              accessibilityLabel="Aller vers la section Survey Questions"
              onPress={goToNextPage}
            />
          </BottomButtonContainer>
          <Spacer.Column numberOfSpaces={4} />
        </Body>
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  flex: 1,
}))

const Body = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
})

const Viewed = styled.View({
  flex: 1,
  flexDirection: 'column',
})

const ButtonContainer = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'left',
  paddingTop: getSpacing(3),
  paddingLeft: getSpacing(3),
  paddingRight: getSpacing(3),
})

const BottomButtonContainer = styled.View({
  position: 'absolute',
  alignItems: 'center',
  left: 0,
  right: 0,
  bottom: getSpacing(8),
})

const StyledTitle = styled(Typo.Title1)({
  textAlign: 'center',
  color: 'white',
})

const StyledCaption = styled(Typo.Caption)({
  textAlign: 'center',
  color: 'white',
})
