import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { Color } from 'features/home/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { CategoryButton } from 'shared/Buttons/CategoryButton'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { getSpacing } from 'ui/theme'
import { newColorMapping } from 'ui/theme/newColorMapping'

const BLOCK_HEIGHT = getSpacing(24)
const DESKTOP_MAX_WIDTH = getSpacing(37.33)

interface CategoryBlockProps {
  title: string
  navigateTo: InternalNavigationProps['navigateTo']
  color: Color
  onBeforePress: () => void | Promise<void>
}

export function CategoryBlock({
  title,
  navigateTo,
  color,
  onBeforePress,
}: Readonly<CategoryBlockProps>) {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <StyledCategoryButton
      label={title}
      height={BLOCK_HEIGHT}
      textColor={newColorMapping[color].text}
      fillColor={newColorMapping[color].fill}
      borderColor={newColorMapping[color].border}
      onPress={() => {
        onBeforePress()
        navigate(navigateTo.screen, navigateTo.params)
      }}
    />
  )
}
const StyledCategoryButton = styled(CategoryButton)(({ theme }) => ({
  flex: '1 0 0',
  minWidth: theme.isMobileViewport ? '35%' : 'none',
  maxWidth: theme.isMobileViewport ? '50%' : DESKTOP_MAX_WIDTH,
}))
