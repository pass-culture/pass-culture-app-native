import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { AgeButton } from 'features/tutorial/components/AgeButton'
import { TutorialTypes } from 'features/tutorial/enums'
import { TutorialPage } from 'features/tutorial/pages/TutorialPage'
import { EligibleAges } from 'features/tutorial/types'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { All } from 'ui/svg/icons/bicolor/All'
import { Spacer, Typo, TypoDS } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

type Props = StackScreenProps<TutorialRootStackParamList, 'AgeSelection'>

const OTHER = 'other'

const ageButtons: { age?: EligibleAges }[] = [
  { age: 15 },
  { age: 16 },
  { age: 17 },
  { age: 18 },
  { age: undefined },
]

const onBeforeNavigate = async (type: TutorialTypes, age?: EligibleAges) => {
  analytics.logSelectAge({ age: age ?? OTHER, from: type })
  age && (await storage.saveObject('user_age', age))
}

export const AgeSelection: FunctionComponent<Props> = ({ route }: Props) => {
  const type = route.params.type

  const AgeSelectionButtons = ageButtons.map(({ age }) => {
    const isOnboarding = type === TutorialTypes.ONBOARDING
    const startButtonTitle = isOnboarding ? 'j’ai' : 'à'
    const AgeInformationScreen = isOnboarding
      ? 'OnboardingAgeInformation'
      : 'ProfileTutorialAgeInformation'

    if (age) {
      return (
        <AgeButton
          key={age}
          Icon={<BicolorAll />}
          onBeforeNavigate={async () => onBeforeNavigate(type, age)}
          navigateTo={{ screen: AgeInformationScreen, params: { age } }}
          accessibilityLabel={`${startButtonTitle} ${age} ans`}>
          <Title4Text>
            {startButtonTitle}
            <Title3Text> {age} ans</Title3Text>
          </Title4Text>
        </AgeButton>
      )
    }
    return (
      <AgeButton
        key="other"
        dense
        onBeforeNavigate={async () => onBeforeNavigate(type)}
        navigateTo={{ screen: 'AgeSelectionOther', params: { type } }}
        accessibilityLabel={`${startButtonTitle} moins de 15 ans ou plus de 18 ans`}>
        <Title4Text>Autre</Title4Text>
        <React.Fragment>
          <Spacer.Column numberOfSpaces={1} />
          <Typo.CaptionNeutralInfo numberOfLines={2}>
            {startButtonTitle} moins de 15 ans ou plus de 18 ans
          </Typo.CaptionNeutralInfo>
        </React.Fragment>
      </AgeButton>
    )
  })

  const title =
    type === TutorialTypes.ONBOARDING
      ? 'Pour commencer, peux-tu nous dire ton âge\u00a0?'
      : 'Comment ça marche\u00a0?'

  const subtitle =
    type === TutorialTypes.ONBOARDING
      ? 'Cela permet de savoir si tu peux bénéficier du pass Culture.'
      : 'De 15 à 18 ans, le pass Culture offre un crédit à dépenser dans l’application pour des activités culturelles.'

  return (
    <TutorialPage title={title} subtitle={subtitle}>
      <AccessibleUnorderedList
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

const Title3Text = styled(TypoDS.Title3).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const Title4Text = styled(Typo.Title4).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.colors.secondary,
}))
