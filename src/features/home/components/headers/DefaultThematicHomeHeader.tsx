import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { useGetThematicHeaderHeight } from 'features/home/components/headers/ThematicHomeHeader'
import { getSpacing, Spacer, Typo, TypoDS } from 'ui/theme'

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
          <TypoDS.Title1 numberOfLines={2}>{headerTitle}</TypoDS.Title1>
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
  marginTop: Platform.OS == 'web' ? getSpacing(6) : getSpacing(2),
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(2),
}))
