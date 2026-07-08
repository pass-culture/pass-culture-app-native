import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components/native'

import { storage, StorageKey } from 'libs/storage'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { AppModal } from 'ui/components/modals/AppModal'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { CircledCheck } from 'ui/svg/icons/CircledCheck'
import { CircledClock } from 'ui/svg/icons/CircledClock'
import { Close } from 'ui/svg/icons/Close'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'

const FOLLOW_ARTIST_SURVEY_URL = 'https://passculture.qualtrics.com/jfe/form/SV_0wafZvbQ06UrZnU'
export const FOLLOW_ARTIST_FAKE_DOOR_SURVEY: StorageKey = 'has_seen_follow_artist_fake_door_survey'

type Props = {
  visible: boolean
  close: () => void
}

export const FollowArtistFakeDoorModal = ({ visible, close }: Props) => {
  const [hasSeenSurvey, setHasSeenSurvey] = useState(false)

  useEffect(() => {
    if (visible) {
      void storage.readString(FOLLOW_ARTIST_FAKE_DOOR_SURVEY).then((val) => {
        setHasSeenSurvey(val === 'true')
      })
    }
  }, [visible])

  const onPressSurvey = async () => {
    if (!hasSeenSurvey) {
      setHasSeenSurvey(true)
      await storage.saveString(FOLLOW_ARTIST_FAKE_DOOR_SURVEY, 'true')
    }
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
        buttonWording: 'Répondre au questionnaire',
        buttonVariant: 'secondary' as const,
      }
    : {
        icon: <StyledCircledClock testID="CircledClock" />,
        body: (
          <StyledBody>
            Cette fonctionnalité n’est pas encore disponible. {'\n'}
            Aide-nous à la créer en donnant ton avis&nbsp;!
          </StyledBody>
        ),
        buttonWording: 'Donner mon avis',
        buttonVariant: 'primary' as const,
      }
  const isZoomed = useMobileFontScaleToDisplay({ default: false, at200PercentZoom: true })
  return (
    <AppModal
      title="Encore un peu de patience…"
      visible={visible}
      rightIcon={Close}
      isUpToStatusBar={isZoomed}
      rightIconAccessibilityLabel="Fermer la fenêtre"
      onRightIconPress={close}>
      <Container gap={4}>
        {content.icon}
        {content.body}
      </Container>

      <ExternalTouchableLink
        as={Button}
        externalNav={{ url: FOLLOW_ARTIST_SURVEY_URL }}
        wording={content.buttonWording}
        fullWidth
        icon={ExternalSiteFilled}
        variant={content.buttonVariant}
        onBeforeNavigate={onPressSurvey}
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
