import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { AgeButton } from 'features/tutorial/components/AgeButton'
import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { TutorialPage } from 'features/tutorial/pages/TutorialPage'
import { EligibleAges } from 'features/tutorial/types'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { storage } from 'libs/storage'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { All } from 'ui/svg/icons/bicolor/All'
import { Spacer, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

type Props = StackScreenProps<TutorialRootStackParamList, 'EligibleUserAgeSelection'>

const ageButtons: { age?: EligibleAges }[] = [
  { age: 15 },
  { age: 16 },
  { age: 17 },
  { age: 18 },
  { age: undefined },
]

const onBeforeNavigate = async (age?: EligibleAges) => {
  analytics.logSelectAge({ age: age ?? NonEligible.OTHER, from: TutorialTypes.ONBOARDING })
  age && (await storage.saveObject('user_age', age))
}

export const EligibleUserAgeSelection: FunctionComponent<Props> = ({ route }: Props) => {
  const isPassForAllEnabled = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_PASS_FOR_ALL)

  const type = route.params.type

  const EligibleUserAgeSelectionButtons = ageButtons.map(({ age }) => {
    if (age) {
      return (
        <AgeButton
          key={age}
          Icon={isPassForAllEnabled ? undefined : <BicolorAll />}
          onBeforeNavigate={async () => onBeforeNavigate(age)}
          navigateTo={{ screen: 'OnboardingAgeInformation' }}
          accessibilityLabel={`J’ai ${age} ans`}>
          <StyledBody>
            J’ai<StyledTitle4> {age} ans</StyledTitle4>
          </StyledBody>
        </AgeButton>
      )
    }
    if (isPassForAllEnabled) {
      return null
    }

    return (
      <AgeButton
        key="other"
        dense
        onBeforeNavigate={async () => onBeforeNavigate()}
        navigateTo={{ screen: 'AgeSelectionOther', params: { type } }}
        accessibilityLabel="J’ai moins de 15 ans ou plus de 18 ans">
        <StyledTitle4>Autre</StyledTitle4>
        <React.Fragment>
          <Spacer.Column numberOfSpaces={1} />
          <StyledBodyAccentXs numberOfLines={2}>
            J’ai moins de 15 ans ou plus de 18 ans
          </StyledBodyAccentXs>
        </React.Fragment>
      </AgeButton>
    )
  })

  const title =
    type === TutorialTypes.ONBOARDING
      ? 'Pour commencer, peux-tu nous dire ton âge\u00a0?'
      : 'Comment ça marche\u00a0?'
  const titleForAll = 'C’est noté\u00a0! Maintenant, quel est ton âge précis\u00a0?'

  const subtitle =
    type === TutorialTypes.ONBOARDING
      ? 'Cela permet de savoir si tu peux bénéficier du pass Culture.'
      : 'De 15 à 18 ans, le pass Culture offre un crédit à dépenser dans l’application pour des activités culturelles.'

  return (
    <TutorialPage
      title={isPassForAllEnabled ? titleForAll : title}
      subtitle={isPassForAllEnabled ? undefined : subtitle}>
      <AccessibleUnorderedList
        items={EligibleUserAgeSelectionButtons}
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

const StyledTitle4 = styled(Typo.Title4).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
