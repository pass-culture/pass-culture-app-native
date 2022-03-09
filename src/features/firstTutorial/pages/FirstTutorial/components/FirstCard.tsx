import { t } from '@lingui/macro'
import React from 'react'

import TutorialPassLogo from 'ui/animations/tutorial_pass_logo.json'
import {
  AchievementCardKeyProps,
  GenericAchievementCard,
} from 'ui/components/achievements/components/GenericAchievementCard'
import { Helmet } from 'ui/web/global/Helmet'

export function FirstCard(props: AchievementCardKeyProps) {
  function onButtonPress() {
    props.swiperRef?.current?.goToNext()
  }

  const currentStep = (props.activeIndex || 0) + 1
  const totalSteps = (props.lastIndex || 3) + 1
  const helmetTitle =
    t({
      values: {
        currentStep,
        totalSteps,
      },
      message: 'Étape {currentStep} sur {totalSteps} | Tutorial "Comment ça marche"',
    }) + ' | pass Culture'
  const buttonAccessibilityLabel = t({
    values: {
      nextStep: currentStep + 1,
      totalSteps,
    },
    message: "Continuer vers l'étape {nextStep} sur {totalSteps}",
  })

  return (
    <React.Fragment>
      <Helmet title={helmetTitle} />
      <GenericAchievementCard
        animation={TutorialPassLogo}
        buttonCallback={onButtonPress}
        buttonText={t`Continuer`}
        buttonAccessibilityLabel={buttonAccessibilityLabel}
        pauseAnimationOnRenderAtFrame={62}
        subTitle={t`c'est...`}
        text={t`une initiative du Gouvernement financée par le ministère de la Culture.`}
        title={t`Le pass Culture`}
        swiperRef={props.swiperRef}
        name={props.name}
        index={props.index}
        activeIndex={props.activeIndex}
        lastIndex={props.lastIndex}
      />
    </React.Fragment>
  )
}
