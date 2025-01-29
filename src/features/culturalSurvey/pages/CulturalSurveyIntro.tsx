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
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Spacer, TypoDS } from 'ui/theme'

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
      icon={StyledBicolorPhonePending}
      titleComponent={TypoDS.Title3}
      title={intro.title}
      subtitle={intro.subtitle}>
      {intro.customSubtitle ? (
        <React.Fragment>
          <StyledBodyAccent>{intro.customSubtitle}</StyledBodyAccent>
          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      ) : null}

      <StyledBody>{intro.bodyText}</StyledBody>
      {intro.showFAQLink ? (
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
      ) : null}
      <Spacer.Flex flex={1} />
      <View>
        <InternalTouchableLink
          key={2}
          as={ButtonPrimary}
          wording="Commencer le questionnaire"
          onBeforeNavigate={analytics.logHasStartedCulturalSurvey}
          navigateTo={{
            screen: 'CulturalSurveyQuestions',
            params: { question: initialQuestions[0] },
          }}
        />
        <Spacer.Column numberOfSpaces={3} />
        <ButtonTertiaryBlack
          key={3}
          wording={intro.secondaryButton.text}
          icon={intro.secondaryButton.icon}
          onPress={intro.secondaryButton.onPress}
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

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})

const StyledBodyAccent = styled(TypoDS.BodyAccent)({
  textAlign: 'center',
})
