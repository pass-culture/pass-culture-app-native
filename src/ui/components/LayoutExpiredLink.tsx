import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { SadFace } from 'ui/svg/icons/SadFace'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

type Props = {
  customSubtitle?: string
  urlFAQ?: string
  primaryButtonInformations?:
    | {
        wording: string
        externalNav: ExternalNavigationProps['externalNav']
        onPress?: never
        icon?: FunctionComponent<AccessibleIcon>
      }
    | {
        wording: string
        onPress: () => void
        externalNav?: never
        icon?: FunctionComponent<AccessibleIcon>
      }
}

export function LayoutExpiredLink({ primaryButtonInformations, urlFAQ, customSubtitle }: Props) {
  const defaultSubtitle =
    'Clique sur «\u00a0Renvoyer l’e-mail\u00a0» pour recevoir un nouveau lien.'

  const goToHomeButtonInformations = {
    wording: 'Retourner à l’accueil',
    navigateTo: navigateToHomeConfig,
    icon: PlainArrowPrevious,
  }

  return (
    <GenericInfoPage
      illustration={SadFace}
      title="Oups&nbsp;!"
      subtitle={customSubtitle ?? defaultSubtitle}
      buttonPrimary={primaryButtonInformations ?? goToHomeButtonInformations}
      buttonTertiary={primaryButtonInformations ? goToHomeButtonInformations : undefined}>
      {urlFAQ ? (
        <FAQContainer gap={2}>
          <StyledBody>Si tu as besoin d’aide n’hésite pas à&nbsp;:</StyledBody>
          <ExternalTouchableLink
            as={Button}
            variant="tertiary"
            color="neutral"
            wording="Consulter l’article d’aide"
            externalNav={{ url: urlFAQ }}
            icon={ExternalSiteFilled}
          />
        </FAQContainer>
      ) : null}
    </GenericInfoPage>
  )
}

const FAQContainer = styled(ViewGap)({
  alignItems: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
