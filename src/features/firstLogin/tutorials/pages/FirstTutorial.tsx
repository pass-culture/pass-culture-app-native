import { t } from '@lingui/macro'
import React from 'react'

import { GenericTutorial } from 'features/firstLogin/tutorials/components/GenericTutorial'
import { _ } from 'libs/i18n'
import TutorialPassLogo from 'ui/animations/tutorial_pass_logo.json'
import { getSpacing } from 'ui/theme'

export function FirstTutorial() {
  return (
    <GenericTutorial
      title={_(t`Le pass Culture`)}
      subTitle={_(t`c'est...`)}
      text={_(t`une initiative financée par le Ministère de la Culture.`)}
      animation={TutorialPassLogo}
      animationSize={getSpacing(60)}
      pauseAnimationOnRenderAtFrame={62}
    />
  )
}
