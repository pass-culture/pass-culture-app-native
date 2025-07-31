import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { useGetThematicHeaderHeight } from 'features/home/api/helpers/useGetThematicHeaderHeight'
import { Spacer, Typo } from 'ui/theme'

interface DefaultThematicHomeHeaderProps {
  headerTitle?: string
  headerSubtitle?: string
}

export const DefaultThematicHomeHeader: FunctionComponent<DefaultThematicHomeHeaderProps> = ({
  headerTitle,
  headerSubtitle,
}) => {
  const headerHeight = useGetThematicHeaderHeight()

  return (
    <Container>
      {headerTitle ? (
        <React.Fragment>
          <HeaderPlaceholder headerHeight={headerHeight} />
          <Typo.Title1 numberOfLines={2}>{headerTitle}</Typo.Title1>
          {headerSubtitle ? (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={2} />
              <Typo.Body numberOfLines={2}>{headerSubtitle}</Typo.Body>
            </React.Fragment>
          ) : null}
          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      ) : null}
    </Container>
  )
}

const HeaderPlaceholder = styled.View<{ headerHeight: number }>(({ headerHeight }) => ({
  height: headerHeight,
}))

const Container = styled.View(({ theme }) => ({
  marginTop:
    Platform.OS == 'web' ? theme.designSystem.size.spacing.xl : theme.designSystem.size.spacing.s,
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: theme.designSystem.size.spacing.s,
}))
