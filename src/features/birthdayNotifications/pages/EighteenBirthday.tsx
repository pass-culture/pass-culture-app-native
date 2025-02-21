import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { storage } from 'libs/storage'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Spacer, TypoDS, getSpacing } from 'ui/theme'
import { CaptionNeutralInfo, TextProps } from 'ui/theme/typography'

const useGetPageWording = (userRequiresIdCheck?: boolean) => {
  const { eighteenYearsOldDeposit } = useDepositAmountsByAge()
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
  const { user } = useAuthContext()
  const pageWording = useGetPageWording(user?.requiresIdCheck)

  useEffect(() => {
    storage.saveObject('has_seen_eligible_card', true)
  }, [])

  return (
    <GenericInfoPageWhite
      animation={TutorialPassLogo}
      title="Tu as 18 ans&nbsp;!"
      subtitle={pageWording.text}
      subtitleComponent={SubtitleComponent}>
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

function SubtitleComponent(props: TextProps) {
  const { data: settings } = useSettingsContext()
  const enableCreditV3 = settings?.wipEnableCreditV3

  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const zero = formatCurrencyFromCents(0, currency, euroToPacificFrancRate)

  return (
    <Wrapper>
      <TypoDS.Body {...props} />
      <Spacer.Column numberOfSpaces={4} />
      {enableCreditV3 ? null : (
        <StyledCaptionNeutralInfo>
          Ton crédit précédent a été remis à {zero}.
        </StyledCaptionNeutralInfo>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.View({
  marginTop: getSpacing(4),
  alignItems: 'center',
})

const StyledCaptionNeutralInfo = styled(CaptionNeutralInfo)({
  textAlign: 'center',
})
