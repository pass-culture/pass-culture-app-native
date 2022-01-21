import { t } from '@lingui/macro'
import React, { useState } from 'react'

import { useDepositAmountsByAge } from 'features/auth/api'
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
      buttonText={t`Vérifier mon identité`}
      pauseAnimationOnRenderAtFrame={62}
      subTitle={t`Tu as 18 ans...`}
      text={t({
        id: 'id check explanation',
        values: { deposit },
        message:
          'Tu pourras bénéficier des {deposit} offerts par le Gouvernement dès que tu auras vérifié ton identité',
      })}
      title={t`Bonne nouvelle\u00a0!`}
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
      lastIndex={props.lastIndex}
      skip={props.skip}
      ignoreBottomPadding={true}
    />
  )
}
