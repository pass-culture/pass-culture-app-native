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
  children: React.JSX.Element
  title: string
  fixedModalBottom: React.JSX.Element
} & ModalLeftIconProps

export const getCookiesModalContent = ({
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
        leftIconAccessibilityLabel: 'Revenir à l’étape précédente',
        leftIcon: ArrowPrevious,
        onLeftIconPress: () => setCookiesStep(CookiesSteps.COOKIES_CONSENT),
        fixedModalBottom: <ButtonPrimary wording="Enregistrer mes choix" onPress={customChoice} />,
        title: 'Réglages des cookies',
      }
    }
    return {
      children: <CookiesConsentExplanations />,
      fixedModalBottom: (
        <CookiesConsentButtons
          onPressAcceptAll={acceptAll}
          onPressDeclineAll={declineAll}
          onPressChooseCookies={() => setCookiesStep(CookiesSteps.COOKIES_SETTINGS)}
        />
      ),
      leftIconAccessibilityLabel: undefined,
      leftIcon: undefined,
      onLeftIconPress: undefined,
      title: 'Respect de ta vie privée',
    }
  }

  return { childrenProps: pickChildren(cookiesStep) }
}
