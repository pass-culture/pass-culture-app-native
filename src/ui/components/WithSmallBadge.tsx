import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Pastille } from 'ui/svg/icons/Pastille'

const SmallBadge = styled(Pastille).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  width: 8,
  height: 8,
  testID: 'smallBadge',
}))({
  position: 'absolute',
  top: 2,
  right: 2,
})

export function WithSmallBadge<P extends object>(Component: FunctionComponent<P>) {
  return function ComponentWithSmallBadge(props: P) {
    return (
      <View>
        <Component {...props} />
        <SmallBadge />
      </View>
    )
  }
}
