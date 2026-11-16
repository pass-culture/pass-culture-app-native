import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { ModalScreenWrapper } from 'shared/ModalScreenWrapper/ModalScreenWrapper'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Close } from 'ui/svg/icons/Close'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'

const PLATFORM_LABELS: Record<string, string> = {
  ios: 'iOS',
  android: 'Android',
}

export const PreviewInstallModal: FunctionComponent = () => {
  const { goBack } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'PreviewInstallModal'>>()
  const downloadUrl = params?.downloadUrl
  const platform = params?.platform

  const platformLabel = platform ? PLATFORM_LABELS[platform] : undefined

  return (
    <ModalScreenWrapper onClose={goBack} title="Installation preview">
      {(closeWithTransition, titleId) => (
        <React.Fragment>
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
