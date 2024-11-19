import React, { ComponentProps, FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { Pastille } from 'ui/svg/icons/Pastille'

const SmallBadge = styled(Pastille).attrs(({ theme }) => ({
  color: theme.colors.primary,
  width: 8,
  height: 8,
  testID: 'smallBadge',
}))({
  position: 'absolute',
  top: 2,
  right: 2,
})

function withSmallBadge<P extends object>(Component: FunctionComponent<P>) {
  return function ComponentWithSmallBadge(props: P) {
    return (
      <View>
        <Component {...props} />
        <SmallBadge />
      </View>
    )
  }
}

export const SmallBadgedButton = withSmallBadge<ComponentProps<typeof RoundedButton>>(RoundedButton)
