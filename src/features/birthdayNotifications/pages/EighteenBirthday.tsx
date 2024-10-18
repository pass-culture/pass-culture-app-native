import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { formatToFrenchDecimal } from 'libs/parsers/getDisplayPrice'
import { storage } from 'libs/storage'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Spacer } from 'ui/theme'
import { CaptionNeutralInfo, Typo } from 'ui/theme/typography'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useGetEuroToXPFRate } from 'libs/parsers/useGetEuroToXPFRate'
import { useGetCurrentCurrency } from 'libs/parsers/useGetCurrentCurrency'

const useGetPageWording = (userRequiresIdCheck?: boolean) => {
  const eighteenYearsOldDeposit = useDepositAmountsByAge().eighteenYearsOldDeposit

  if (userRequiresIdCheck) {
    return {
      text: `Vérifie ton identité pour débloquer tes ${eighteenYearsOldDeposit}.`,
      buttonText: 'Vérifier mon identité',
    }
  }
  return {
    text: `Confirme tes informations personnelles pour débloquer tes ${eighteenYearsOldDeposit}.`,
    buttonText: 'Confirmer mes informations',
  }
}

export function EighteenBirthday() {
  const currency = useGetCurrentCurrency()
  const euroToXPFRate = useGetEuroToXPFRate()

  const { user } = useAuthContext()
  const pageWording = useGetPageWording(user?.requiresIdCheck)

  useEffect(() => {
    storage.saveObject('has_seen_eligible_card', true)
  }, [])

  return (
    <GenericInfoPageWhite animation={TutorialPassLogo} title="Tu as 18 ans&nbsp;!">
      <StyledTitle>{pageWording.text}</StyledTitle>
      <Spacer.Column numberOfSpaces={4} />
      <StyledCaptionNeutralInfo>
        Ton crédit précédent a été remis à {formatToFrenchDecimal(0, currency, euroToXPFRate)}.
      </StyledCaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={8} />
      <InternalTouchableLink
        as={ButtonPrimary}
        wording={pageWording.buttonText}
        navigateTo={{ screen: 'Stepper' }}
      />
      <Spacer.Column numberOfSpaces={2} />

      <InternalTouchableLink
        as={ButtonTertiaryBlack}
        wording="Plus tard"
        navigateTo={{ screen: 'TabNavigator', params: { screen: 'Home' } }}
        icon={ClockFilled}
      />
    </GenericInfoPageWhite>
  )
}

const StyledCaptionNeutralInfo = styled(CaptionNeutralInfo)({
  textAlign: 'center',
})

const StyledTitle = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  textAlign: 'center',
})
