import { t } from '@lingui/macro'
import React from 'react'

import TutorialPassLogo from 'ui/animations/tutorial_pass_logo.json'
import {
  AchievementCardKeyProps,
  GenericAchievementCard,
} from 'ui/components/achievements/components/GenericAchievementCard'

export function FirstCard(props: AchievementCardKeyProps) {
  function onButtonPress() {
    props.swiperRef?.current?.goToNext()
  }

  return (
    <GenericAchievementCard
      animation={TutorialPassLogo}
      buttonCallback={onButtonPress}
      buttonText={t`Continuer`}
      pauseAnimationOnRenderAtFrame={62}
      subTitle={t`c'est...`}
      text={t`une initiative financée par le Ministère de la Culture.`}
      title={t`Le pass Culture`}
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
      lastIndex={props.lastIndex}
    />
  )
}
