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
      <TextContainer>
        {headerTitle ? (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={6} />
            <Typo.Title1 numberOfLines={1}>{headerTitle}</Typo.Title1>
          </React.Fragment>
        ) : null}
        {headerSubtitle ? (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={2} />
            <Typo.Body numberOfLines={1}>{headerSubtitle}</Typo.Body>
          </React.Fragment>
        ) : null}
      </TextContainer>
    </Container>
  )
}

const Container = styled.View({
  marginTop: Platform.OS == 'web' ? getSpacing(6) : undefined,
  marginHorizontal: getSpacing(4),
  marginBottom: getSpacing(2),
})

const TextContainer = styled.View({
  marginHorizontal: getSpacing(2),
})
