import React from 'react'

import { LayoutButtonProps } from 'features/search/types'
import { LayoutButton } from 'ui/components/buttons/LayoutButton'
import { List } from 'ui/svg/icons/List'

export const ListLayoutButton = ({
  isSelected,
  onPress,
  layout,
}: Omit<LayoutButtonProps, 'Icon'>) => (
  <LayoutButton isSelected={isSelected} Icon={List} onPress={onPress} layout={layout} />
)
