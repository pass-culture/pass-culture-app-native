import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { AgeButton } from 'features/onboarding/components/AgeButton'
import { OnboardingPage } from 'features/onboarding/pages/OnboardingPage'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { storage } from 'libs/storage'
import { AccessibilityList } from 'ui/components/accessibility/AccessibilityList'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { All } from 'ui/svg/icons/bicolor/All'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Spacer, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

const ageButtons = [{ age: 15 }, { age: 16 }, { age: 17 }, { age: 18 }, { age: undefined }]

const onBeforeNavigate = async (age: number | string) => {
  analytics.logSelectAge(age)
  age && (await storage.saveObject('user_age', age))
}

const logGoToParentsFAQ = () => analytics.logGoToParentsFAQ('ageselection')

export const AgeSelection: FunctionComponent = () => {
  const AgeSelectionButtons = ageButtons.map(({ age }, index) => {
    return (
      <AgeButton
        key={index}
        icon={age ? BicolorAll : undefined}
        dense={!age}
        onBeforeNavigate={async () => onBeforeNavigate(age || 'other')}
        navigateTo={
          age ? { screen: 'AgeInformation', params: { age } } : { screen: 'AgeSelectionOther' }
        }
        accessibilityLabel={`j’ai ${age} ans`}>
        {age ? (
          <Title4Text>
            j’ai <Title3Text>{age} ans</Title3Text>
          </Title4Text>
        ) : (
          <Title4Text>Autre</Title4Text>
        )}
        {!age && (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={1} />
            <Typo.CaptionNeutralInfo numberOfLines={2}>
              j’ai moins de 15 ans ou plus de 18 ans
            </Typo.CaptionNeutralInfo>
          </React.Fragment>
        )}
      </AgeButton>
    )
  })
  AgeSelectionButtons.push(
    <ExternalTouchableLink
      key={AgeSelectionButtons.length}
      as={ButtonTertiaryBlack}
      wording="Je suis un parent"
      icon={InfoPlain}
      onBeforeNavigate={logGoToParentsFAQ}
      externalNav={{ url: env.FAQ_LINK_LEGAL_GUARDIAN }}
    />
  )

  return (
    <OnboardingPage
      title="Pour commencer, peux-tu nous dire ton âge&nbsp;?"
      subtitle="Cela permet de savoir si tu peux bénéficier du pass Culture."
      onGoBack={navigateToHome}>
      <AccessibilityList
        items={AgeSelectionButtons}
        Separator={<Spacer.Column numberOfSpaces={4} />}
      />
    </OnboardingPage>
  )
}

const BicolorAll = styled(All).attrs(({ theme }) => ({
  color: theme.colors.primary,
  color2: theme.colors.secondary,
  size: theme.icons.sizes.small,
}))``

const Title3Text = styled(Typo.Title3).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const Title4Text = styled(Typo.Title4).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.colors.secondary,
}))
