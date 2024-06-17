import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { FAQ_LINK_USER_DATA } from 'features/culturalSurvey/constants'
import { useCulturalSurveyContext } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Spacer, Typo } from 'ui/theme'

const FAQTouchableLinkProps = {
  as: ButtonTertiaryBlack,
  wording: 'En savoir plus',
  icon: InfoPlain,
  accessibilityLabel: 'En savoir plus sur ce qu’on fait de tes données',
}

const SHARE_APP_MODAL_STORAGE_KEY = 'has_seen_share_app_modal'

export const CulturalSurveyIntro = (): React.JSX.Element => {
  const { questionsToDisplay: initialQuestions } = useCulturalSurveyContext()
  const { reset } = useNavigation<UseNavigationType>()
  const { showShareAppModal } = useShareAppContext()

  const navigateSendAnalyticsAndShowShareAppModal = async () => {
    reset({
      index: 0,
      routes: [{ name: navigateToHomeConfig.screen }],
    })
    analytics.logHasSkippedCulturalSurvey()
    const hasSeenShareAppModal = await storage.readObject(SHARE_APP_MODAL_STORAGE_KEY)
    if (hasSeenShareAppModal) return
    showShareAppModal(ShareAppModalType.BENEFICIARY)
    await storage.saveObject(SHARE_APP_MODAL_STORAGE_KEY, true)
  }

  useEffect(() => {
    const incrementTotalCulturalSurveyDisplay = async () => {
      const totalCulturalSurveyDisplays =
        (await storage.readObject<number>('times_cultural_survey_has_been_requested')) || 0

      await storage.saveObject(
        'times_cultural_survey_has_been_requested',
        totalCulturalSurveyDisplays + 1
      )
    }

    incrementTotalCulturalSurveyDisplay()
  }, [])

  return (
    <GenericInfoPageWhite
      icon={StyledBicolorPhonePending}
      titleComponent={Typo.Title3}
      title="Prends 1 minute"
      subtitle="pour nous parler de tes activités culturelles préférées">
      <StyledBody>
        En continuant, tu acceptes que nous utilisions les réponses au questionnaire qui va suivre
        pour améliorer l’application.
      </StyledBody>
      <View>
        {Platform.OS === 'web' ? (
          <ExternalTouchableLink
            key={1}
            externalNav={{
              url: FAQ_LINK_USER_DATA,
            }}
            {...FAQTouchableLinkProps}
          />
        ) : (
          <InternalTouchableLink
            key={1}
            navigateTo={{
              screen: 'FAQWebview',
            }}
            {...FAQTouchableLinkProps}
          />
        )}
      </View>
      <Spacer.Flex flex={1} />
      <View>
        <InternalTouchableLink
          key={2}
          as={ButtonPrimary}
          wording="Débuter le questionnaire"
          onBeforeNavigate={analytics.logHasStartedCulturalSurvey}
          navigateTo={{
            screen: 'CulturalSurveyQuestions',
            params: { question: initialQuestions[0] },
          }}
        />
        <Spacer.Column numberOfSpaces={3} />
        <ButtonTertiaryBlack
          key={3}
          wording="Plus tard"
          icon={ClockFilled}
          onPress={navigateSendAnalyticsAndShowShareAppModal}
        />
      </View>
    </GenericInfoPageWhite>
  )
}

const StyledBicolorPhonePending = styled(BicolorPhonePending).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
  color: theme.colors.primary,
  color2: theme.colors.secondary,
}))``

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
