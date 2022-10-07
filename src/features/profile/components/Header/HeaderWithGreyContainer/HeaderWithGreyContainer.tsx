import { useFocusEffect } from '@react-navigation/native'
import React, { FunctionComponent, ReactNode, useCallback } from 'react'
import { StatusBar } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing, Spacer, Typo } from 'ui/theme'

type PropsWithChildren = {
  title: string
  subtitle?: ReactNode | string
}

export const HeaderWithGreyContainer: FunctionComponent<PropsWithChildren> = ({
  title,
  subtitle,
  children,
}) => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content', true)
      return () => StatusBar.setBarStyle('light-content', true)
    }, [])
  )

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <TitleContainer>
        <Typo.Title1 numberOfLines={2}>{title}</Typo.Title1>
      </TitleContainer>
      {!!subtitle && (
        <SubtitleContainer>
          {typeof subtitle === 'string' ? <Typo.Body>{subtitle}</Typo.Body> : subtitle}
        </SubtitleContainer>
      )}
      {!!children && <GreyContainer>{children}</GreyContainer>}
    </React.Fragment>
  )
}

const TitleContainer = styled.View(({ theme }) => ({
  marginTop: getSpacing(6),
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(2),
}))

const SubtitleContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(5),
}))

const GreyContainer = styled.View(({ theme }) => ({
  padding: getSpacing(6),
  borderRadius: getSpacing(2),
  backgroundColor: theme.colors.greyLight,
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginBottom: getSpacing(2),
  width: theme.isDesktopViewport ? 'fit-content' : undefined,
  minWidth: theme.isDesktopViewport ? theme.contentPage.maxWidth : undefined,
}))
