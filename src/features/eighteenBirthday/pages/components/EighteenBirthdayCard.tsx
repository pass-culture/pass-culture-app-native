import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { useDepositAmountsByAge } from 'features/auth/api'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { useUserProfileInfo } from 'features/home/api'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { AchievementCardKeyProps, GenericAchievementCard } from 'ui/components/achievements'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function EighteenBirthdayCard(props: AchievementCardKeyProps) {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: profile } = useUserProfileInfo()
  const { showInfoSnackBar } = useSnackBarContext()
  const depositAmount = useDepositAmountsByAge().eighteenYearsOldDeposit
  const deposit = depositAmount.replace(' ', '')

  const { navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation()

  const prefetchedInfo = {
    nextBeneficiaryValidationStep: profile?.nextBeneficiaryValidationStep ?? null,
  }

  function onButtonPress() {
    if (profile) {
      navigateToNextBeneficiaryValidationStep(prefetchedInfo)
    } else {
      // TODO: remove after POs validation this will happen only when POs access this page without auth
      navigate('Login')
      showInfoSnackBar({
        message: t`Tu n'es pas connecté !`,
      })
    }
  }

  return (
    <GenericAchievementCard
      animation={TutorialPassLogo}
      buttonCallback={onButtonPress}
      buttonText={t`Vérifier mon identité`}
      pauseAnimationOnRenderAtFrame={62}
      subTitle={t`Tu as 18 ans...`}
      text={t({
        id: 'id check explanation',
        values: { deposit },
        message:
          'Tu pourras bénéficier des {deposit} offerts par le Ministère de la Culture dès que tu auras vérifié ton identité',
      })}
      title={t`Bonne nouvelle !`}
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
      lastIndex={props.lastIndex}
      skip={props.skip}
    />
  )
}
