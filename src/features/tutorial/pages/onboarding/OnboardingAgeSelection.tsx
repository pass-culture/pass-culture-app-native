import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AgeButton } from 'features/tutorial/components/AgeButton'
import { TutorialPage } from 'features/tutorial/pages/TutorialPage'
import { EligibleAges } from 'features/tutorial/types'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { AccessibilityList } from 'ui/components/accessibility/AccessibilityList'
import { All } from 'ui/svg/icons/bicolor/All'
import { Spacer, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

const OTHER = 'other'

const ageButtons: { age?: EligibleAges }[] = [
  { age: 15 },
  { age: 16 },
  { age: 17 },
  { age: 18 },
  { age: undefined },
]

const onBeforeNavigate = async (age?: EligibleAges) => {
  analytics.logSelectAge(age ?? OTHER)
  age && (await storage.saveObject('user_age', age))
}

export const OnboardingAgeSelection: FunctionComponent = () => {
  const AgeSelectionButtons = ageButtons.map(({ age }) => {
    return (
      <AgeButton
        key={age}
        icon={age ? BicolorAll : undefined}
        dense={!age}
        onBeforeNavigate={async () => onBeforeNavigate(age)}
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

  return (
    <TutorialPage
      title="Pour commencer, peux-tu nous dire ton âge&nbsp;?"
      subtitle="Cela permet de savoir si tu peux bénéficier du pass Culture.">
      <AccessibilityList
        items={AgeSelectionButtons}
        Separator={<Spacer.Column numberOfSpaces={4} />}
      />
    </TutorialPage>
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
