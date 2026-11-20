import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { resolvePreviewInstallForModal } from 'features/preview/resolvePreviewInstallForModal'
import { ModalScreenWrapper } from 'shared/ModalScreenWrapper/ModalScreenWrapper'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Close } from 'ui/svg/icons/Close'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'

const PLATFORM_LABELS = {
  ios: 'iOS',
  android: 'Android',
} as const

export const PreviewInstallModal: FunctionComponent = () => {
  const { goBack } = useGoBack(...homeNavigationConfig)
  const { params } = useRoute<UseRouteType<'PreviewInstallModal'>>()
  const { downloadUrl, platform, channel, fingerprint } = params
  const [showDownload, setShowDownload] = useState(false)

  const platformLabel = platform ? PLATFORM_LABELS[platform] : undefined

  useEffect(
    () =>
      void resolvePreviewInstallForModal({
        channel,
        fingerprint,
        downloadUrl,
        onMatched: goBack,
        onMismatch: () => setShowDownload(true),
      }),
    [channel, downloadUrl, fingerprint, goBack]
  )

  if (!showDownload) return null

  return (
    <ModalScreenWrapper onClose={goBack} title="Installation preview">
      {(closeWithTransition, titleId) => (
        <React.Fragment>
          <Spacer.TopScreen />
          <HeaderContainer>
            <ModalHeader
              title="Installation preview"
              titleID={titleId}
              rightIconAccessibilityLabel="Fermer la modale"
              rightIcon={Close}
              onRightIconPress={closeWithTransition}
            />
          </HeaderContainer>

          <Content gap={6}>
            <Typo.Body>
              {platformLabel
                ? `Une nouvelle version preview (${platformLabel}) est disponible.`
                : 'Une nouvelle version preview est disponible.'}
            </Typo.Body>
            <Typo.Body>
              Télécharge-la pour tester cette branche. L’installation remplacera l’app preview déjà
              présente sur ton appareil.
            </Typo.Body>
          </Content>

          <FooterContainer>
            {downloadUrl ? (
              <ExternalTouchableLink
                as={Button}
                wording="Télécharger"
                icon={ExternalSiteFilled}
                fullWidth
                externalNav={{ url: downloadUrl }}
              />
            ) : (
              <Button wording="Fermer" onPress={closeWithTransition} fullWidth />
            )}
          </FooterContainer>
          <Spacer.BottomScreen />
        </React.Fragment>
      )}
    </ModalScreenWrapper>
  )
}

const HeaderContainer = styled.View(({ theme }) => ({
  padding: theme.designSystem.size.spacing.l,
  width: '100%',
}))

const Content = styled(ViewGap)(({ theme }) => ({
  flex: 1,
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  marginTop: theme.designSystem.size.spacing.xl,
}))

const FooterContainer = styled.View(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  paddingBottom: theme.modal.spacing.LG,
}))
