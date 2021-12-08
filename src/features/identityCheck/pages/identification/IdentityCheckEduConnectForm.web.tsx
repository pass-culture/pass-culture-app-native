import { t } from '@lingui/macro'
import { EduConnectError, EduConnectErrorBoundary, EduConnectErrors } from '@pass-culture/id-check'
// TODO PC-12075 : remove idCheck imports
import { IdCardMagnifyingGlassIcon } from '@pass-culture/id-check/src/components/icons/IdCardMagnifyingGlass'
import { ErrorTrigger } from '@pass-culture/id-check/src/errors/ErrorTrigger'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components/native'

import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useEduconnect } from 'features/identityCheck/utils/useEduConnect'
import { eduConnectClient } from 'libs/eduConnectClient'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export const IdentityCheckEduConnectForm = () => {
  const { shouldUseEduConnect } = useEduconnect()
  const [error, setError] = useState<EduConnectError | null>(
    shouldUseEduConnect ? null : new EduConnectError(EduConnectErrors.unavailable)
  )

  const checkIfEduConnectIsAvailable = useCallback(() => {
    if (shouldUseEduConnect === false) {
      setError(new EduConnectError(EduConnectErrors.unavailable))
    }
  }, [shouldUseEduConnect])

  const openEduConnect = useCallback(() => {
    async function setWebView() {
      if (!eduConnectClient) {
        return
      }
      try {
        const { getAccessToken, getLoginUrl } = eduConnectClient
        const accessToken = await getAccessToken()
        const { status, headers } = await fetch(`${getLoginUrl()}?redirect=false`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          mode: 'cors',
          credentials: 'include',
        })
        if (status === 204) {
          const finalURL = headers.get('educonnect-redirect')
          if (finalURL) {
            globalThis.window.open(finalURL, '_blank')
            return
          }
          setError(new EduConnectError(EduConnectErrors.unavailable, 'EduConnectRedirectError'))
        }
      } catch (err) {
        // @ts-ignore TODO remove this when all migration from idCheck is completed
        setError(err)
      }
    }
    setWebView()
  }, [eduConnectClient])

  useFocusEffect(
    useCallback(() => {
      openEduConnect()
      checkIfEduConnectIsAvailable()
    }, [checkIfEduConnectIsAvailable, openEduConnect])
  )

  if (error) {
    throw error
  }

  return (
    <ErrorBoundary FallbackComponent={EduConnectErrorBoundary}>
      <PageWithHeader
        title={t`Mon identité`}
        scrollChildren={
          <React.Fragment>
            <Center>
              <IdCardMagnifyingGlassIcon size={getSpacing(47)} />
            </Center>

            <JustifiedHeader color={ColorsEnum.GREY_DARK}>{t`Identification`}</JustifiedHeader>
            <Spacer.Column numberOfSpaces={4} />

            <JustifiedText color={ColorsEnum.GREY_DARK}>
              {t`Pour procéder à ton identification, nous allons te demander de te connecter à ÉduConnect. Muni toi de ton identifiant et de ton mot de passe ÉduConnect. Dès que tu as bien complété le parcours, reviens sur ce site pour terminer ton inscription et découvrir toutes les offres du pass Culture !`}
            </JustifiedText>

            <Spacer.Column numberOfSpaces={8} />
          </React.Fragment>
        }
        fixedBottomChildren={
          <ButtonPrimary title={t`Ouvrir un onglet ÉduConnect`} onPress={openEduConnect} />
        }
      />
      <ErrorTrigger error={error} />
    </ErrorBoundary>
  )
}

const Center = styled.View({
  alignSelf: 'center',
})

const JustifiedText = styled(Typo.Body)({
  textAlign: 'center',
})

const JustifiedHeader = styled(Typo.ButtonText)({
  textAlign: 'center',
})
