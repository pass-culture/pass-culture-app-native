import React, { PropsWithChildren } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export const MainLandmark = ({
  accessibilityRole,
  children,
}: PropsWithChildren<{ accessibilityRole?: AccessibilityRole }>) => {
  if (Platform.OS !== 'web' || !accessibilityRole)
    return <React.Fragment>{children}</React.Fragment>
  return <Container accessibilityRole={accessibilityRole}>{children}</Container>
}

const Container = styled.View({ flex: 1 })
