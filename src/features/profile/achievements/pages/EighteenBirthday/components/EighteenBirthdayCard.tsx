import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { NavigateToHomeWithoutModalOptions } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { AchievementCardKeyProps, GenericAchievementCard } from 'ui/components/achievements'

export function EighteenBirthdayCard(props: AchievementCardKeyProps) {
  const { navigate } = useNavigation<UseNavigationType>()

  function onButtonPress() {
    navigate('Home', NavigateToHomeWithoutModalOptions)
  }

  return (
    <GenericAchievementCard
      animation={TutorialPassLogo}
      buttonCallback={onButtonPress}
      buttonText={_(t`Verifier mon identité`)}
      pauseAnimationOnRenderAtFrame={62}
      subTitle={_(t`Tu as 18 ans...`)}
      text={_(
        t`Tu pourras bénéficier des 300€ offerts par le Ministère de la Culture dès que tu auras vérifié ton identité`
      )}
      title={_(t`Bonne nouvelle !`)}
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
      lastIndex={props.lastIndex}
      skip={props.skip}
    />
  )
}
