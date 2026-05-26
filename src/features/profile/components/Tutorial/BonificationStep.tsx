import React from 'react'

import { BonificationAllStep } from 'features/profile/components/Tutorial/BonificationAllStep'
import { BonificationFamilyQuotientStep } from 'features/profile/components/Tutorial/BonificationFamilyQuotientStep'
import { BonificationHandicapStep } from 'features/profile/components/Tutorial/BonificationHandicapStep'
import { UserProfile } from 'features/share/types'

type Props = {
  amount: string
  isLoggedIn: boolean
  user?: UserProfile
  resetBannerVisibility: () => void
  enableHandicapBonification: boolean
  enableFamilyQuotientBonification: boolean
}

export const BonificationStep = ({
  amount,
  isLoggedIn,
  user,
  resetBannerVisibility,
  enableHandicapBonification,
  enableFamilyQuotientBonification,
}: Props) => {
  const showAllBonifications = enableHandicapBonification && enableFamilyQuotientBonification

  if (showAllBonifications) {
    return (
      <BonificationAllStep
        amount={amount}
        user={user}
        isLoggedIn={isLoggedIn}
        resetBannerVisibility={resetBannerVisibility}
      />
    )
  }

  if (enableFamilyQuotientBonification) {
    return (
      <BonificationFamilyQuotientStep
        amount={amount}
        user={user}
        isLoggedIn={isLoggedIn}
        resetBannerVisibility={resetBannerVisibility}
      />
    )
  }

  if (enableHandicapBonification) {
    return <BonificationHandicapStep amount={amount} user={user} isLoggedIn={isLoggedIn} />
  }

  return null
}
