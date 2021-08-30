import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { openExternalUrl } from 'features/navigation/helpers'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { LogoPassCulture } from 'ui/svg/icons/LogoPassCulture'
import { PageNotFoundIcon } from 'ui/svg/icons/PageNotFoundIcon'
import { ColorsEnum, Spacer, Typo, getSpacing } from 'ui/theme'

// This component is web only and is not supposed to be shown on native (ios or android)
export const RedirectWebToNative: React.FC = () => {
  const { showErrorSnackBar } = useSnackBarContext()
  function onPressOpenLink() {
    const url: string | undefined = window?.location?.href
    if (!url) {
      showErrorSnackBar({ message: t`Désolé, cette URL n'est pas valide.` })
    }
    openExternalUrl(url)
  }
  return (
    <React.Fragment>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <GenericInfoPage
        title={t`Ce lien fonctionne uniquement sur notre application mobile !`}
        icon={PageNotFoundIcon}
        iconSize={getSpacing(25)}>
        <Spacer.Column numberOfSpaces={2} />
        <StyledBody>{t`1. Tu peux installer l'application :`}</StyledBody>
        <Spacer.Column numberOfSpaces={2} />
        <Row>
          <ExternalLink
            color={ColorsEnum.WHITE}
            text={t`PlayStore`}
            url="https://play.google.com/store/apps/details?id=app.passculture.webapp&hl=fr"
          />
          <Spacer.Row numberOfSpaces={6} />
          <ExternalLink
            color={ColorsEnum.WHITE}
            text={t`AppStore`}
            url="https://apps.apple.com/fr/app/pass-culture/id1557887412"
          />
        </Row>
        <Spacer.Column numberOfSpaces={6} />
        <StyledBody>{t`2. Puis réessayer d'ouvrir ce lien sur le navigateur de ton téléphone :`}</StyledBody>
        <Spacer.Column numberOfSpaces={4} />
        <ButtonPrimary title={t`Ouvrir le lien`} onPress={onPressOpenLink} />
        <Spacer.Column numberOfSpaces={8} />
        <InlineTextGroup>
          <StyledBody>{t`Si tu rencontres à nouveau des difficultés, consulte`}</StyledBody>
          <Spacer.Row numberOfSpaces={1} />
          <ExternalLink
            color={ColorsEnum.WHITE}
            text={t`notre centre d'aide`}
            url="https://aide.passculture.app/fr/articles/5260446-j-ai-un-probleme-avec-les-liens-sur-mon-application"
          />
        </InlineTextGroup>
        <LogoPassCulture width={getSpacing(35)} height={getSpacing(25)} />
      </GenericInfoPage>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})

const Row = styled.View({ flexDirection: 'row' })

const InlineTextGroup = styled.Text({
  flexWrap: 'wrap',
  flexShrink: 1,
  textAlign: 'center',
})
