import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Pastille } from 'ui/svg/icons/Pastille'

const SmallBadge = styled(Pastille).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  width: theme.designSystem.size.spacing.m,
  height: theme.designSystem.size.spacing.m,
  testID: 'smallBadge',
}))({
  position: 'absolute',
  right: -4,
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
