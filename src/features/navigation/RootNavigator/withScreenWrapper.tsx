import React, { ComponentType, memo } from 'react'
import styled from 'styled-components/native'

import { useScreenshotListener } from 'features/navigation/RootNavigator/useScreenshotListener'
import { useE2eTestId } from 'libs/e2e/useE2eTestId'

export const withScreenWrapper = (Component: ComponentType, name: string) => {
  return memo(function ComponentWithScreenWrapper(props = {}) {
    const e2eTestId = useE2eTestId(name)

    useScreenshotListener()

    return (
      <View {...e2eTestId}>
        <Component {...props} />
      </View>
    )
  })
}

const View = styled.View({
  flex: 1,
})
