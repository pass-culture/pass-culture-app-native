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
  const helmetTitle = `Étape ${currentStep} sur ${totalSteps} | Tutorial "Comment ça marche" | pass Culture`
  const buttonAccessibilityLabel = `Continuer vers l'étape ${currentStep + 1} sur ${totalSteps}`

  return (
    <React.Fragment>
      <Helmet title={helmetTitle} />
      <GenericAchievementCard
        animation={TutorialPassLogo}
        buttonCallback={onButtonPress}
        buttonText="Continuer"
        buttonAccessibilityLabel={buttonAccessibilityLabel}
        pauseAnimationOnRenderAtFrame={62}
        title="Le pass Culture"
        subTitle="c'est..."
        text="une initiative du Gouvernement financée par le ministère de la Culture."
        swiperRef={props.swiperRef}
        name={props.name}
        index={props.index}
        activeIndex={props.activeIndex}
        lastIndex={props.lastIndex}
      />
    </React.Fragment>
  )
}
