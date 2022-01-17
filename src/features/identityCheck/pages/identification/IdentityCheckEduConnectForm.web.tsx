import { t } from '@lingui/macro'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components/native'

import { ErrorTrigger } from 'features/identityCheck/atoms/ErrorTrigger'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { EduConnectErrorBoundary } from 'features/identityCheck/errors/eduConnect/EduConnectErrorBoundary'
import { EduConnectError } from 'features/identityCheck/errors/eduConnect/types'
import { EduConnectErrorMessageEnum } from 'features/identityCheck/errors/hooks/useNotEligibleEduConnectErrorData'
import { eduConnectClient } from 'libs/eduConnectClient'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { Info } from 'ui/svg/icons/Info'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export const IdentityCheckEduConnectForm = () => {
  const [error, setError] = useState<EduConnectError | null>(null)

  const openEduConnect = useCallback(() => {
    const windowReference = globalThis.window.open()

    async function setWebView() {
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
          if (finalURL && windowReference) {
            windowReference.location = finalURL
            return
          }
          setError(new EduConnectError(EduConnectErrorMessageEnum.GenericError))
        }
      } catch (err) {
        setError(new EduConnectError(EduConnectErrorMessageEnum.GenericError))
      }
    }
    setWebView()
  }, [eduConnectClient])

  useFocusEffect(
    useCallback(() => {
      openEduConnect()
    }, [openEduConnect])
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
              <BicolorIdCardWithMagnifyingGlass size={getSpacing(33)} />
            </Center>

            <JustifiedHeader color={ColorsEnum.GREY_DARK}>{t`Identification`}</JustifiedHeader>
            <Spacer.Column numberOfSpaces={4} />

            <JustifiedText color={ColorsEnum.GREY_DARK}>
              {t`Pour t’identifier, nous allons te demander de te connecter à EduConnect. Munis-toi de ton identifiant et ton mot de passe EduConnect\u00a0! Si tu ne les as pas, contacte ton établissement pour les récupérer.`}
            </JustifiedText>
            <Spacer.Column numberOfSpaces={4} />
            <HavingTroubleContainer>
              <Info />
              <Spacer.Row numberOfSpaces={2} />

              <Typo.Caption color={ColorsEnum.GREY_DARK}>
                {t`Un souci pour accéder à la page\u00a0? Essaie en navigation privée ou pense bien à accepter les pop-ups de ton navigateur.`}
              </Typo.Caption>
            </HavingTroubleContainer>

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
  padding: getSpacing(7),
})

const JustifiedText = styled(Typo.Body)({
  textAlign: 'center',
})

const JustifiedHeader = styled(Typo.ButtonText)({
  textAlign: 'center',
})

const HavingTroubleContainer = styled.View(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: theme.colors.greyLight,
  padding: getSpacing(4),
  borderRadius: theme.borderRadius.checkbox,
}))
