import React, { ComponentType, memo } from 'react'
import styled from 'styled-components/native'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withWebWrapper = (Component: ComponentType<any>) => {
  return memo(function ComponentWithWebWrapper(props = {}) {
    return (
      <SiteWrapper>
        <SiteContainer>
          <Component {...props} />
        </SiteContainer>
      </SiteWrapper>
    )
  })
}

const SiteWrapper = styled.View(({ theme }) => ({
  flex: 1,
  margin: 'auto',
  width: '100%',
  backgroundColor: theme.colors.greyLight,
}))

const SiteContainer = styled.View(({ theme }) => ({
  flex: 1,
  width: '100%',
  margin: 'auto',
  maxWidth: theme.appContentWidth,
}))
