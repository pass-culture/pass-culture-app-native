import React, { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { AppModal } from 'ui/components/modals/AppModal'
import { ModalSpacing } from 'ui/components/modals/enum'
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
  const { height } = useWindowDimensions()
  const { top } = useCustomSafeInsets()

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
      modalSpacing={ModalSpacing.MD}
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

const FixedBottomChildrenView = styled.View({
  marginTop: getSpacing(5),
  paddingHorizontal: ModalSpacing.MD,
  alignItems: 'center',
})
