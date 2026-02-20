import React from 'react'
import styled from 'styled-components/native'

import { OfferHeaderViewProps } from 'features/offerRefacto/types'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Share } from 'ui/svg/icons/Share'

export const OfferHeaderView = ({
  viewModel,
  headerTransition,
  children,
}: Readonly<OfferHeaderViewProps>) => {
  const { title, shareModal, onBackPress, onSharePress, onDismissShareModal } = viewModel

  return (
    <React.Fragment>
      <ContentHeader
        headerTitle={title}
        headerTransition={headerTransition}
        titleTestID="offerHeaderName"
        onBackPress={onBackPress}
        RightElement={
          <ButtonsWrapper gap={3}>
            <Button
              iconButton
              icon={Share}
              onPress={onSharePress}
              accessibilityLabel="Partager"
              variant="secondary"
              color="neutral"
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
