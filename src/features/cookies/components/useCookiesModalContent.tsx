import { t } from '@lingui/macro'
import React from 'react'

import { CookiesConsentButtons } from 'features/cookies/components/CookiesConsentButtons'
import { CookiesConsentExplanations } from 'features/cookies/components/CookiesConsentExplanations'
import { CookiesSteps } from 'features/cookies/enums'
import { CookiesDetails } from 'features/cookies/pages/CookiesDetails'
import { CookiesChoiceByCategory } from 'features/cookies/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'

interface Props {
  cookiesStep: number
  settingsCookiesChoice: CookiesChoiceByCategory
  setCookiesStep: (number: CookiesSteps) => void
  setSettingsCookiesChoice: React.Dispatch<React.SetStateAction<CookiesChoiceByCategory>>
  acceptAll: () => void
  declineAll: () => void
  customChoice: () => void
}

type ReportOfferModalContent = {
  children: JSX.Element
  title: string
  fixedBottomChildren: JSX.Element
} & ModalLeftIconProps

export const useCookiesModalContent = ({
  cookiesStep,
  settingsCookiesChoice,
  setCookiesStep,
  setSettingsCookiesChoice,
  acceptAll,
  declineAll,
  customChoice,
}: Props) => {
  const pickChildren = (step: CookiesSteps): ReportOfferModalContent => {
    if (step === CookiesSteps.COOKIES_SETTINGS) {
      return {
        children: (
          <CookiesDetails
            settingsCookiesChoice={settingsCookiesChoice}
            setSettingsCookiesChoice={setSettingsCookiesChoice}
          />
        ),
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
