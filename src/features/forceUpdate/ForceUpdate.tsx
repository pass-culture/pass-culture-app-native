import { t } from '@lingui/macro'
import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { Star } from 'ui/svg/icons/Star'
import { Typo } from 'ui/theme'

const ANDROID_STORE_LINK = `https://play.google.com/store/apps/details?id=${env.ANDROID_APP_ID}`
const IOS_STORE_LINK = `https://apps.apple.com/fr/app/pass-culture/id${env.IOS_APP_STORE_ID}`

const STORE_LINK = Platform.select({
  ios: IOS_STORE_LINK,
  android: ANDROID_STORE_LINK,
  default: ANDROID_STORE_LINK,
})

const onPress = Platform.select({
  default: () => openUrl(STORE_LINK),
  web: () => globalThis?.window?.location?.reload(),
})

const title = Platform.select({
  default: t`Mise à jour de l'application`,
  web: t`Mise à jour de l'application`,
})

const description = Platform.select({
  default: t`Le pass Culture ne semble plus à jour sur ton téléphone\u00a0!
                Pour des questions de performance et de sécurité merci de télécharger la dernière version disponible.`,
  web: t`Le pass Culture de ton navigateur ne semble plus à jour\u00a0!
                Pour des questions de performance et de sécurité merci d'actualiser la page pour obtenir la dernière version disponible.`,
})

const buttonText = Platform.select({
  default: t`Télécharger la dernière version`,
  web: t`Actualiser la page`,
})

export const ForceUpdate = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <GenericInfoPage
        title={title}
        icon={Star}
        buttons={[<ButtonPrimaryWhite key={buttonText} wording={buttonText} onPress={onPress} />]}>
        <StyledBody>{description}</StyledBody>
      </GenericInfoPage>
    </React.Fragment>
  )
}
const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))
