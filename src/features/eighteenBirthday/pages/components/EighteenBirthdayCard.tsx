import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { useGetIdCheckToken } from 'features/auth/api'
import { useUserProfileInfo } from 'features/home/api'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { MonitoringError } from 'libs/errorMonitoring'
import { _ } from 'libs/i18n'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { AchievementCardKeyProps, GenericAchievementCard } from 'ui/components/achievements'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function EighteenBirthdayCard(props: AchievementCardKeyProps) {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: idCheckTokenResponse } = useGetIdCheckToken(true)
  const { data: profile } = useUserProfileInfo()
  const { displayInfosSnackBar } = useSnackBarContext()

  function onButtonPress() {
    if (profile && idCheckTokenResponse?.token) {
      navigate('IdCheck', { email: profile.email, licenceToken: idCheckTokenResponse.token })
    } else if (profile && !idCheckTokenResponse?.token) {
      // TODO: when backend treat non eligible as an error instead of null, change this error handling
      throw new MonitoringError(
        _(t`Nous ne pouvons pas vérifier ton identité pour le moment, reviens plus tard !`),
        'NotEligibleIdCheckError'
      )
    } else {
      // TODO: remove after POs validation this will happen only when POs access this page without auth
      navigate('Login')
      displayInfosSnackBar({
        message: _(t`Tu n'es pas connecté !`),
      })
    }
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
