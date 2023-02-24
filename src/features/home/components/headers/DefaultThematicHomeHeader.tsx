import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { BackButton } from 'ui/components/headers/BackButton'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export interface DefaultThematicHomeHeaderProps {
  headerTitle?: string
  headerSubtitle?: string
}
export const DefaultThematicHomeHeader: FunctionComponent<DefaultThematicHomeHeaderProps> = ({
  headerTitle,
  headerSubtitle,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const onGoBack = useCallback(() => navigate(...homeNavConfig), [navigate])

  return (
    <Container>
      <Spacer.TopScreen />
      <BackButton onGoBack={onGoBack} />
      {headerTitle ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <TitleContainer>
            <Typo.Title1 numberOfLines={2}>{headerTitle}</Typo.Title1>
            {headerSubtitle ? (
              <React.Fragment>
                <Spacer.Column numberOfSpaces={2} />
                <Typo.Body numberOfLines={2}>{headerSubtitle}</Typo.Body>
              </React.Fragment>
            ) : null}
          </TitleContainer>
          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      ) : null}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  marginTop: Platform.OS == 'web' ? getSpacing(6) : getSpacing(2),
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(2),
}))

const TitleContainer = styled.View(({ theme }) => ({
  // The size of the title block should not exceed two lines of title and one of subtitle
  maxHeight:
    parseInt(theme.typography.title1.lineHeight) * 2 +
    getSpacing(2) +
    parseInt(theme.typography.body.lineHeight),
  overflow: 'hidden',
}))
