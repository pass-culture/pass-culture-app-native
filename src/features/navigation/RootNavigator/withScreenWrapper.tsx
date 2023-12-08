import React, { ComponentType, memo } from 'react'
import styled from 'styled-components/native'

import { useScreenshotListener } from 'features/navigation/RootNavigator/useScreenshotListener'

export const withScreenWrapper = (Component: ComponentType, name: string) => {
  return memo(function ComponentWithScreenWrapper(props = {}) {
    useScreenshotListener()

    return (
      <View testID={name}>
        <Component {...props} />
      </View>
    )
  })
}

const View = styled.View({
  flex: 1,
})
