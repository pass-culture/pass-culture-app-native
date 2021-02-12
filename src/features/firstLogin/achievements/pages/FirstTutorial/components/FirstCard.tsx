import { t } from '@lingui/macro'
import React from 'react'

import { _ } from 'libs/i18n'
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
      buttonText={_(t`Continuer`)}
      pauseAnimationOnRenderAtFrame={62}
      subTitle={_(t`c'est...`)}
      text={_(t`une initiative financée par le Ministère de la Culture.`)}
      title={_(t`Le pass Culture`)}
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
    />
  )
}
