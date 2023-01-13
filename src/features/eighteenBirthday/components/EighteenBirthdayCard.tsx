import React, { useState } from 'react'

import { useDepositAmountsByAge } from 'features/auth/helpers/useDepositAmountsByAge'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { AchievementCardKeyProps, GenericAchievementCard } from 'ui/components/achievements'

export function EighteenBirthdayCard(props: AchievementCardKeyProps) {
  const [error, setError] = useState<Error | undefined>()
  const depositAmount = useDepositAmountsByAge().eighteenYearsOldDeposit
  const deposit = depositAmount.replace(' ', '')

  const { navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation(setError)

  if (error) {
    throw error
  }

  return (
    <GenericAchievementCard
      animation={TutorialPassLogo}
      buttonCallback={navigateToNextBeneficiaryValidationStep}
      buttonText="Vérifier mon identité"
      pauseAnimationOnRenderAtFrame={62}
      subTitle="Tu as 18 ans..."
      text={`Tu pourras bénéficier des ${deposit} offerts par l’État dès que tu auras vérifié ton identité`}
      title="Bonne nouvelle&nbsp;!"
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
      lastIndex={props.lastIndex}
      skip={props.skip}
      ignoreBottomPadding
    />
  )
}
