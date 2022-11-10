import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { BackButton } from 'ui/components/headers/BackButton'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export interface ThematicHomeHeaderProps {
  headerTitle?: string
  headerSubtitle?: string
}
export const ThematicHomeHeader: FunctionComponent<ThematicHomeHeaderProps> = ({
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
            <Typo.Title1 numberOfLines={1}>{headerTitle}</Typo.Title1>
          </React.Fragment>
        ) : null}
        {headerSubtitle ? (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={2} />
            <Typo.Body numberOfLines={1}>{headerSubtitle}</Typo.Body>
          </React.Fragment>
        ) : null}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  marginTop: Platform.OS == 'web' ? getSpacing(6) : undefined,
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(2),
}))
