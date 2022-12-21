import React, { ComponentType, memo } from 'react'
import styled from 'styled-components/native'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withScreenWrapper = (Component: ComponentType<any>, name: string) => {
  return memo(function ComponentWithScreenWrapper(props = {}) {
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
