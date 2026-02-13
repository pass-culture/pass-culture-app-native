import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { WebShareModal } from 'features/share/pages/WebShareModal'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

import { OfferHeaderViewProps } from './types'

/**
 * Vue pure du header d'offre
 * DR014 : Responsabilité unique = affichage
 */
export function OfferHeaderView({
  viewModel,
  headerTransition,
  children,
}: Readonly<OfferHeaderViewProps>) {
  const theme = useTheme()

  const { title, animationState, shareModal, onBackPress, onSharePress, onDismissShareModal } =
    viewModel

  return (
    <React.Fragment>
      <ContentHeader
        headerTitle={title}
        headerTransition={headerTransition}
        titleTestID="offerHeaderName"
        onBackPress={onBackPress}
        RightElement={
          <ButtonsWrapper gap={3}>
            <RoundedButton
              animationState={animationState}
              iconName="share"
              onPress={onSharePress}
              accessibilityLabel="Partager"
              finalColor={theme.designSystem.color.icon.default}
            />
            {children}
          </ButtonsWrapper>
        }
      />
      {shareModal.content ? (
        <WebShareModal
          visible={shareModal.isVisible}
          headerTitle={shareModal.title}
          shareContent={shareModal.content}
          dismissModal={onDismissShareModal}
        />
      ) : null}
    </React.Fragment>
  )
}

const ButtonsWrapper = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
})
