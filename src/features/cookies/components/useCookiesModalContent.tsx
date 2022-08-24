import { t } from '@lingui/macro'
import React from 'react'

import { CookiesConsentButtons } from 'features/cookies/components/CookiesConsentButtons'
import { CookiesConsentExplanations } from 'features/cookies/components/CookiesConsentExplanations'
import { CookiesDetails } from 'features/cookies/pages/CookiesDetails'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'

export enum CookiesSteps {
  COOKIES_CONSENT = 0,
  COOKIES_SETTINGS = 1,
}

interface Props {
  cookiesStep: number
  setCookiesStep: (number: CookiesSteps) => void
  hideModal: () => void
}

type ReportOfferModalContent = {
  children: JSX.Element
  title: string
  fixedBottomChildren: JSX.Element
} & ModalLeftIconProps

export const useCookiesModalContent = ({ cookiesStep, setCookiesStep, hideModal }: Props) => {
  const pickChildren = (step: CookiesSteps): ReportOfferModalContent => {
    if (step === CookiesSteps.COOKIES_SETTINGS) {
      return {
        children: <CookiesDetails />,
        leftIconAccessibilityLabel: t`Revenir à l'étape précédente`,
        leftIcon: ArrowPrevious,
        onLeftIconPress: () => setCookiesStep(CookiesSteps.COOKIES_CONSENT),
        fixedBottomChildren: (
          <ButtonPrimary wording={t`Enregistrer mes choix`} onPress={() => null} />
        ),
        title: t`Réglages des cookies`,
      }
    }
    return {
      children: <CookiesConsentExplanations />,
      fixedBottomChildren: (
        <CookiesConsentButtons
          onPressAcceptAll={hideModal}
          onPressDeclineAll={hideModal}
          onPressChooseCookies={() => setCookiesStep(CookiesSteps.COOKIES_SETTINGS)}
        />
      ),
      leftIconAccessibilityLabel: undefined,
      leftIcon: undefined,
      onLeftIconPress: undefined,
      title: t`Respect de ta vie privée`,
    }
  }

  return { childrenProps: pickChildren(cookiesStep) }
}
