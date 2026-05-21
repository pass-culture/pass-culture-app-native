import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { useGetThematicHeaderHeight } from 'features/home/api/helpers/useGetThematicHeaderHeight'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { Typo } from 'ui/theme'

interface DefaultThematicHomeHeaderProps {
  headerTitle?: string
  headerSubtitle?: string
}

export const DefaultThematicHomeHeader: FunctionComponent<DefaultThematicHomeHeaderProps> = ({
  headerTitle,
  headerSubtitle,
}) => {
  const headerHeight = useGetThematicHeaderHeight()
  const numberOfLinesTitle = useMobileFontScaleToDisplay({
    default: 2,
    at200PercentZoom: undefined,
  })
  const numberOfLinesSubtitle = useMobileFontScaleToDisplay({
    default: 1,
    at200PercentZoom: undefined,
  })
  return (
    <Container>
      {headerTitle ? (
        <HeaderContainer>
          <HeaderPlaceholder headerHeight={headerHeight} />
          <Typo.Title1 numberOfLines={numberOfLinesTitle}>{headerTitle}</Typo.Title1>
          {headerSubtitle ? (
            <HeaderSubtitleContainer>
              <Typo.Body numberOfLines={numberOfLinesSubtitle}>{headerSubtitle}</Typo.Body>
            </HeaderSubtitleContainer>
          ) : null}
        </HeaderContainer>
      ) : null}
    </Container>
  )
}

const HeaderContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const HeaderPlaceholder = styled.View<{ headerHeight: number }>(({ headerHeight }) => ({
  height: headerHeight,
}))

const Container = styled.View(({ theme }) => ({
  marginTop:
    Platform.OS == 'web' ? theme.designSystem.size.spacing.xl : theme.designSystem.size.spacing.s,
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: theme.designSystem.size.spacing.s,
}))

const HeaderSubtitleContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
}))
