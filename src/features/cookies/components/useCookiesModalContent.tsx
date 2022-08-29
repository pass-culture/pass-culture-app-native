import { t } from '@lingui/macro'
import React from 'react'

import { CookiesConsentButtons } from 'features/cookies/components/CookiesConsentButtons'
import { CookiesConsentExplanations } from 'features/cookies/components/CookiesConsentExplanations'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { CookiesDetails } from 'features/cookies/pages/CookiesDetails'
import { useCookies } from 'features/cookies/useCookies'
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
  const { cookiesChoice, setCookiesChoice } = useCookies()

  const acceptAll = () => {
    setCookiesChoice({
      ...cookiesChoice,
      choiceDatetime: new Date(),
      consent: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: ALL_OPTIONAL_COOKIES,
        refused: [],
      },
    })
    hideModal()
  }

  const declineAll = () => {
    setCookiesChoice({
      ...cookiesChoice,
      choiceDatetime: new Date(),
      consent: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: ALL_OPTIONAL_COOKIES,
      },
    })
    hideModal()
  }

  const customChoice = () => {
    hideModal()
  }

  const pickChildren = (step: CookiesSteps): ReportOfferModalContent => {
    if (step === CookiesSteps.COOKIES_SETTINGS) {
      return {
        children: <CookiesDetails />,
        leftIconAccessibilityLabel: t`Revenir à l'étape précédente`,
        leftIcon: ArrowPrevious,
        onLeftIconPress: () => setCookiesStep(CookiesSteps.COOKIES_CONSENT),
        fixedBottomChildren: (
          <ButtonPrimary wording={t`Enregistrer mes choix`} onPress={customChoice} />
        ),
        title: t`Réglages des cookies`,
      }
    }
    return {
      children: <CookiesConsentExplanations />,
      fixedBottomChildren: (
        <CookiesConsentButtons
          onPressAcceptAll={acceptAll}
          onPressDeclineAll={declineAll}
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
