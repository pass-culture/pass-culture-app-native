import { t } from '@lingui/macro'
import React from 'react'

import { useDepositAmountsByAge } from 'features/auth/api'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { AchievementCardKeyProps, GenericAchievementCard } from 'ui/components/achievements'

export function EighteenBirthdayCard(props: AchievementCardKeyProps) {
  const depositAmount = useDepositAmountsByAge().eighteenYearsOldDeposit
  const deposit = depositAmount.replace(' ', '')

  const { navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation()

  return (
    <GenericAchievementCard
      animation={TutorialPassLogo}
      buttonCallback={navigateToNextBeneficiaryValidationStep}
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
