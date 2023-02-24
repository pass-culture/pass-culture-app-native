import React, { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const CookiesConsentModal: typeof AppModal = ({
  title,
  visible,
  fixedModalBottom,
  children,
  ...iconProps
}) => {
  const { top } = useCustomSafeInsets()
  const { modal } = useTheme()
  const { height } = useWindowDimensions()

  const CustomHeader = useMemo(
    () => (
      <HeaderContainer>
        <ModalHeader title={title} {...iconProps} />
      </HeaderContainer>
    ),
    [title, iconProps]
  )

  const FixedModalBottom = useMemo(
    () => <FixedBottomChildrenView>{fixedModalBottom}</FixedBottomChildrenView>,
    [fixedModalBottom]
  )

  return (
    <AppModal
      noPadding
      visible={visible}
      title={title}
      maxHeight={height - top}
      modalSpacing={modal.spacing.MD}
      customModalHeader={CustomHeader}
      fixedModalBottom={FixedModalBottom}>
      {children}
    </AppModal>
  )
}

const HeaderContainer = styled.View({
  paddingTop: getSpacing(6),
  paddingBottom: getSpacing(5),
  paddingHorizontal: getSpacing(6),
  width: '100%',
})

const FixedBottomChildrenView = styled.View(({ theme }) => ({
  marginTop: getSpacing(5),
  paddingHorizontal: theme.modal.spacing.MD,
  alignItems: 'center',
}))
