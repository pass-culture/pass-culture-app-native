import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { FAQ_LINK_USER_DATA } from 'features/culturalSurvey/constants'
import { useCulturalSurveyContext } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/firebase/analytics'
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

export const CulturalSurveyIntro = (): JSX.Element => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { questionsToDisplay: initialQuestions } = useCulturalSurveyContext()

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
            externalNav={{
              url: FAQ_LINK_USER_DATA,
            }}
            {...FAQTouchableLinkProps}
          />
        ) : (
          <InternalTouchableLink
            navigateTo={{
              screen: 'FAQWebview',
            }}
            {...FAQTouchableLinkProps}
          />
        )}
      </View>
      <Spacer.Flex flex={1} />
      <View>
        {/* TODO(anoukhello) use an InternalTouchableLink instead of button */}
        <ButtonPrimary
          onPress={() => {
            analytics.logHasStartedCulturalSurvey()
            navigate('CulturalSurveyQuestions', {
              question: initialQuestions[0],
            })
          }}
          wording="Débuter le questionnaire"
        />
        <Spacer.Column numberOfSpaces={3} />
        {/* TODO(anoukhello) use an InternalTouchableLink instead of button */}
        <ButtonTertiaryBlack
          wording="Plus tard"
          onPress={() => {
            analytics.logHasSkippedCulturalSurvey()
            navigateToHome()
          }}
          icon={ClockFilled}
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
