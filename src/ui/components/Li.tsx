import React, { PropsWithChildren } from 'react'
import { Platform, ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

const isWeb = Platform.OS === 'web'

export interface AccessibleLiProps extends ViewProps {
  index: number
  total: number
  groupLabel: string
  accessibilityLabel: string
  accessibilityRole?: AccessibilityRole
}

interface SimpleLiProps extends ViewProps {
  index?: never
  total?: never
  groupLabel?: never
  accessibilityLabel?: never
  accessibilityRole?: AccessibilityRole
}

type LiProps = PropsWithChildren<AccessibleLiProps | SimpleLiProps>

export const Li: React.FC<LiProps> = ({
  groupLabel,
  index,
  total,
  accessibilityLabel,
  accessibilityRole,
  children,
  ...rest
}) => {
  const withAccessibilityLabel =
    groupLabel !== undefined &&
    index !== undefined &&
    total !== undefined &&
    accessibilityLabel !== undefined

  if (withAccessibilityLabel) {
    const computedLabel = `${groupLabel} – Liste - Élément ${index + 1} sur ${total} - ${accessibilityLabel}`
    return (
      <StyledView
        {...rest}
        accessible
        accessibilityRole={isWeb ? AccessibilityRole.LISTITEM : accessibilityRole}
        accessibilityLabel={isWeb ? undefined : computedLabel}>
        {children}
      </StyledView>
    )
  }

  return (
    <StyledView
      {...rest}
      accessible
      accessibilityRole={isWeb ? AccessibilityRole.LISTITEM : accessibilityRole}>
      {children}
    </StyledView>
  )
}

const StyledView = styled.View({
  display: Platform.OS === 'web' ? 'list-item' : 'flex',
})
