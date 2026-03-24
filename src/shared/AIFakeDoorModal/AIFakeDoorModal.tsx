import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components/native'

import { Position } from 'libs/location/types'
import { buildAISurveyURL } from 'shared/AIFakeDoorModal/buildAISurveyURL'
import { AppModal } from 'ui/components/modals/AppModal'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { CircledCheck } from 'ui/svg/icons/CircledCheck'
import { CircledClock } from 'ui/svg/icons/CircledClock'
import { Close } from 'ui/svg/icons/Close'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'

export const AI_SURVEY_URL = 'https://passculture.qualtrics.com/jfe/form/SV_9M3POmHFECvQCc6'
export const AI_FAKE_DOOR_SURVEY = 'AIFakeDoorSurvey'

type Props = {
  visible: boolean
  close: () => void
  userLocation: Position
  userCity?: string | null
}

export const AIFakeDoorModal = ({ visible, close, userLocation, userCity }: Props) => {
  const [hasSeenSurvey, setHasSeenSurvey] = useState(false)

  useEffect(() => {
    if (visible) {
      AsyncStorage.getItem(AI_FAKE_DOOR_SURVEY).then((val) => {
        setHasSeenSurvey(val === 'true')
      })
    }
  }, [visible])

  const markHasSeen = async () => {
    setHasSeenSurvey(true)
    await AsyncStorage.setItem(AI_FAKE_DOOR_SURVEY, 'true')
    close()
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
            Nous avons besoin de ton aide <Typo.BodyAccent>3 min</Typo.BodyAccent> pour la mettre en
            place&nbsp;!
          </StyledBody>
        ),
        buttonVariant: 'primary',
      }

  return (
    <AppModal
      title="Encore un peu de patience..."
      visible={visible}
      rightIcon={Close}
      rightIconAccessibilityLabel="Fermer la fenêtre"
      onRightIconPress={close}>
      <Container gap={4}>
        {content.icon}
        {content.body}
      </Container>

      <ExternalTouchableLink
        as={Button}
        externalNav={{ url: buildAISurveyURL(userLocation, userCity) }}
        wording="Répondre au questionnaire"
        fullWidth
        icon={ExternalSiteFilled}
        variant={content.buttonVariant}
        onBeforeNavigate={hasSeenSurvey ? close : markHasSeen}
      />

      {hasSeenSurvey ? (
        <CloseButtonContainer>
          <Button wording="Fermer" onPress={close} />
        </CloseButtonContainer>
      ) : null}
    </AppModal>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  alignItems: 'center',
  marginBottom: theme.designSystem.size.spacing.xxl,
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
}))
