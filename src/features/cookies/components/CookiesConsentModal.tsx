import React from 'react'
import { useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const CookiesConsentModal: typeof AppModal = ({
  title,
  visible,
  fixedModalBottom,
  children,
  ...iconProps
}) => {
  const { height } = useWindowDimensions()
  const { top } = useCustomSafeInsets()
  const { modal } = useTheme()

  return (
    <AppModal
      noPadding
      visible={visible}
      title={title}
      maxHeight={height - top}
      modalSpacing={modal.spacing.MD}
      customModalHeader={
        <HeaderContainer>
          <ModalHeader title={title} {...iconProps} />
        </HeaderContainer>
      }
      fixedModalBottom={<FixedBottomChildrenView>{fixedModalBottom}</FixedBottomChildrenView>}>
      {children}
    </AppModal>
  )
}

const HeaderContainer = styled.View(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.xl,
  paddingBottom: theme.designSystem.size.spacing.xl,
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  width: '100%',
}))

const FixedBottomChildrenView = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
  paddingHorizontal: theme.modal.spacing.MD,
  alignItems: 'center',
}))
