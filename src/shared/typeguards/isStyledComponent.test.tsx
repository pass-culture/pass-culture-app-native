import React, { FunctionComponent } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components/native'

import { isStyledComponent } from 'shared/typeguards/isStyledComponent'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'

const StyledArrowRight = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

describe('isStyledComponent', () => {
  it('should return true for styled components', () => {
    expect(isStyledComponent(StyledArrowRight)).toEqual(true)
  })

  it('should return false for non-styled components', () => {
    const NonStyledComponent: FunctionComponent = () => (
      <View>
        <Text>Non-Styled Component</Text>
      </View>
    )

    expect(isStyledComponent(NonStyledComponent)).toEqual(false)
  })

  it('should return false for regular React components', () => {
    const RegularComponent: FunctionComponent = () => (
      <View>
        <Text>Regular Component</Text>
      </View>
    )

    expect(isStyledComponent(RegularComponent)).toEqual(false)
  })
})
