import React from 'react'

import { LayoutButtonProps } from 'features/search/types'
import { LayoutButton } from 'ui/components/buttons/LayoutButton'
import { Grid } from 'ui/svg/icons/Grid'

export const GridLayoutButton = ({
  isSelected,
  onPress,
  layout,
}: Omit<LayoutButtonProps, 'Icon'>) => (
  <LayoutButton isSelected={isSelected} Icon={Grid} onPress={onPress} layout={layout} />
)
