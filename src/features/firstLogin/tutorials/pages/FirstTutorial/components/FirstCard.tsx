import { t } from '@lingui/macro'
import React from 'react'

import { CardKey, GenericCard } from 'features/firstLogin/tutorials/components/GenericCard'
import { _ } from 'libs/i18n'
import { storage } from 'libs/storage'
import TutorialPassLogo from 'ui/animations/tutorial_pass_logo.json'

export function FirstCard(props: CardKey) {
  function onButtonPress() {
    storage.saveObject('has_seen_tutorials', true)
    props.swiperRef?.current?.goToNext()
  }
  return (
    <GenericCard
      animation={TutorialPassLogo}
      buttonCallback={onButtonPress}
      buttonText={_(t`Continuer`)}
      pauseAnimationOnRenderAtFrame={62}
      subTitle={_(t`c'est...`)}
      text={_(t`une initiative financée par le Ministère de la Culture.`)}
      title={_(t`Le pass Culture`)}
      {...props}
    />
  )
}
