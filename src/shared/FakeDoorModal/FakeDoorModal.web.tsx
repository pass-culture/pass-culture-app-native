import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components/native'

import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { ModalScreenWrapper } from 'shared/ModalScreenWrapper/ModalScreenWrapper'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { CircledCheck } from 'ui/svg/icons/CircledCheck'
import { CircledClock } from 'ui/svg/icons/CircledClock'
import { Close } from 'ui/svg/icons/Close'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'

export const FakeDoorModal = () => {
  const { goBack } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'FakeDoorModal'>>()
  const { surveyKey, surveyUrl } = params
  const [hasSeenSurvey, setHasSeenSurvey] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(surveyKey).then((val) => {
      setHasSeenSurvey(val === 'true')
    })
  }, [surveyKey])

  const markHasSeen = async () => {
    setHasSeenSurvey(true)
    await AsyncStorage.setItem(surveyKey, 'true')
    goBack()
  }

  const content = hasSeenSurvey
    ? {
        icon: <StyledCircledCheck testID="CircleChecked" />,
        body: (
          <StyledBody>
            Il semble que tu aies déjà répondu au questionnaire. Si ce n’est pas le cas, prends{' '}
            <Typo.BodyAccent>3 min</Typo.BodyAccent> pour y répondre&nbsp;!
          </StyledBody>
        ),
        buttonVariant: 'secondary',
      }
    : {
        icon: <StyledCircledClock testID="CircledClock" />,
        body: (
          <StyledBody>
            Cette fonctionnalité n’est pas encore disponible. {'\n'}
            Aide-nous à la créer en donnant ton avis&nbsp;!
          </StyledBody>
        ),
        buttonVariant: 'primary',
      }

  return (
    <ModalScreenWrapper onClose={goBack}>
      {(closeWithTransition) => (
        <React.Fragment>
          <HeaderContainer>
            <ModalHeader
              title="Encore un peu de patience..."
              rightIconAccessibilityLabel="Fermer la fenêtre"
              rightIcon={Close}
              onRightIconPress={closeWithTransition}
            />
          </HeaderContainer>

          <Container gap={4}>
            {content.icon}
            {content.body}
          </Container>

          <ButtonContainer>
            <ExternalTouchableLink
              as={Button}
              externalNav={{ url: surveyUrl }}
              wording="Répondre au questionnaire"
              fullWidth
              icon={ExternalSiteFilled}
              variant={content.buttonVariant}
              onBeforeNavigate={hasSeenSurvey ? goBack : markHasSeen}
            />
          </ButtonContainer>

          {hasSeenSurvey ? (
            <CloseButtonContainer>
              <Button wording="Fermer" onPress={goBack} />
            </CloseButtonContainer>
          ) : null}
        </React.Fragment>
      )}
    </ModalScreenWrapper>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  alignItems: 'center',
  marginBottom: theme.designSystem.size.spacing.xxl,
  paddingHorizontal: theme.designSystem.size.spacing.xl,
}))

const ButtonContainer = styled.View(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xl,
}))

const StyledCircledCheck = styled(CircledCheck).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const StyledCircledClock = styled(CircledClock).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const CloseButtonContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
  alignItems: 'center',
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

const HeaderContainer = styled.View(({ theme }) => ({
  padding: theme.designSystem.size.spacing.l,
  width: '100%',
}))
