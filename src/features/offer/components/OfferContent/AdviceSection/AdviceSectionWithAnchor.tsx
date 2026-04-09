import React, { FunctionComponent, PropsWithChildren, useCallback, useRef } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { AnchorName } from 'ui/components/anchor/anchor-name'
import { useRegisterAnchor } from 'ui/components/anchor/AnchorContext'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'

type Props = PropsWithChildren<{
  sectionId: string
  anchorSectionId: string
  anchorName: AnchorName
}>

export const AdviceSectionWithAnchor: FunctionComponent<Props> = ({
  sectionId,
  anchorSectionId,
  anchorName,
  children,
}) => {
  const clubAdviceSectionRef = useRef<View>(null)
  const registerAnchor = useRegisterAnchor()

  const handleLayout = useCallback(() => {
    if (clubAdviceSectionRef.current) {
      registerAnchor(anchorName, clubAdviceSectionRef)
    }
  }, [anchorName, registerAnchor])

  return (
    <StyledSectionWithDivider visible testID={sectionId} gap={8}>
      <View ref={clubAdviceSectionRef} onLayout={handleLayout} testID={anchorSectionId}>
        {children}
      </View>
    </StyledSectionWithDivider>
  )
}

const StyledSectionWithDivider = styled(SectionWithDivider)(({ theme }) => ({
  paddingBottom: theme.designSystem.size.spacing.xxl,
}))
