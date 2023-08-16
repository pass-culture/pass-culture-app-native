import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { AchievementCardKeyProps, GenericAchievementCard } from 'ui/components/achievements'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const DescriptionText = (text: string) => {
  const Component = () => (
    <React.Fragment>
      <CenterChildContainer>
        <StyledCenterChild>{text}</StyledCenterChild>
        <Spacer.Column numberOfSpaces={4} />
      </CenterChildContainer>
    </React.Fragment>
  )
  return Component
}

export function EighteenBirthdayCard(props: AchievementCardKeyProps) {
  const { user } = useAuthContext()
  const { navigate } = useNavigation<UseNavigationType>()

  let text = 'Confirme tes informations personnelles pour débloquer tes 300\u00a0€.'
  let buttonText = 'Confirmer mes informations'

  if (user?.requiresIdCheck === true) {
    text = 'Vérifie ton identité pour débloquer tes 300\u00a0€.'
    buttonText = 'Vérifier mon identité'
  }

  const navigateToStepper = () => navigate('Stepper')

  return (
    <GenericAchievementCard
      animation={TutorialPassLogo}
      buttonCallback={navigateToStepper}
      buttonText={buttonText}
      pauseAnimationOnRenderAtFrame={62}
      centerChild={DescriptionText(text)}
      text={'Ton crédit précédent a été remis à 0\u00a0€.'}
      title="Tu as 18 ans&nbsp;!"
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
      lastIndex={props.lastIndex}
      skip={props.skip}
      ignoreBottomPadding
    />
  )
}

const CenterChildContainer = styled.View({
  flexDirection: 'column',
  justifyContent: 'center',
})

const StyledCenterChild = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  textAlign: 'center',
  alignSelf: 'center',
})
