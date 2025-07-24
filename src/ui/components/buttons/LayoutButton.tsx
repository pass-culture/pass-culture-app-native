import React, { useMemo } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { LayoutButtonProps } from 'features/search/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Checkmark } from 'ui/svg/icons/Checkmark'
import { Typo, getSpacing } from 'ui/theme'

export const LayoutButton = ({ isSelected, Icon, onPress, layout }: LayoutButtonProps) => {
  const { designSystem } = useTheme()

  const StyledIcon = useMemo(() => {
    return Icon
      ? styled(Icon).attrs(({ theme }) => ({
          color: isSelected
            ? theme.designSystem.color.icon.brandPrimary
            : theme.designSystem.color.icon.default,
          size: theme.icons.sizes.extraSmall,
        }))``
      : null
  }, [Icon, isSelected])

  return (
    <TouchableOpacity id={layout} onPress={onPress}>
      <TitleContainer gap={2} isSelected={isSelected}>
        {StyledIcon ? (
          <IconsContainer gap={2}>
            {isSelected ? <Checkmark color={designSystem.color.icon.brandPrimary} /> : null}
            <StyledIcon testID={`${layout}-icon`} />
          </IconsContainer>
        ) : null}
        {isSelected ? <Title isSelected={isSelected}>{layout}</Title> : null}
      </TitleContainer>
    </TouchableOpacity>
  )
}

const TitleContainer = styled(ViewGap)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: isSelected
    ? theme.designSystem.color.background.brandPrimarySelected
    : undefined,
  padding: getSpacing(2),
  borderRadius: getSpacing(2),
}))

const IconsContainer = styled(ViewGap)({
  flexDirection: 'row',
})

const Title = styled(Typo.BodyAccent)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected
    ? theme.designSystem.color.text.brandPrimary
    : theme.designSystem.color.text.default,
}))
