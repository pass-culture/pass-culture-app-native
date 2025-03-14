import React, { useEffect } from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { FAQ_LINK_USER_DATA } from 'features/culturalSurvey/constants'
import { useCulturalSurveyContext } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { useGetCulturalSurveyContent } from 'features/culturalSurvey/helpers/useGetCulturalSurveyContent'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { storage } from 'libs/storage'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { TypoDS } from 'ui/theme'

const FAQTouchableLinkProps = {
  as: ButtonTertiaryBlack,
  wording: 'En savoir plus',
  icon: InfoPlain,
  accessibilityLabel: 'En savoir plus sur ce qu’on fait de tes données',
}

export const CulturalSurveyIntro = (): React.JSX.Element => {
  const enableCulturalSurveyMandatory = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY
  )
  const { questionsToDisplay: initialQuestions } = useCulturalSurveyContext()

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

  const { intro } = useGetCulturalSurveyContent(enableCulturalSurveyMandatory)

  return (
    <GenericInfoPageWhite
      illustration={BicolorPhonePending}
      title={intro.title}
      subtitle={intro.customSubtitle}
      buttonPrimary={{
        wording: 'Commencer le questionnaire',
        onBeforeNavigate: analytics.logHasStartedCulturalSurvey,
        navigateTo: {
          screen: 'CulturalSurveyQuestions',
          params: { question: initialQuestions[0] },
        },
      }}
      buttonTertiary={{
        wording: intro.secondaryButton.text,
        icon: intro.secondaryButton.icon,
        onPress: intro.secondaryButton.onPress,
      }}>
      <StyledBody>{intro.bodyText}</StyledBody>
      {intro.showFAQLink ? (
        <View>
          {Platform.OS === 'web' ? (
            <ExternalTouchableLink
              key={1}
              externalNav={{ url: FAQ_LINK_USER_DATA }}
              {...FAQTouchableLinkProps}
            />
          ) : (
            <InternalTouchableLink
              key={1}
              navigateTo={{ screen: 'FAQWebview' }}
              {...FAQTouchableLinkProps}
            />
          )}
        </View>
      ) : null}
    </GenericInfoPageWhite>
  )
}

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})
