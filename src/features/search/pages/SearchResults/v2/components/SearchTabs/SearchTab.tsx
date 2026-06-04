import React, { FC, ComponentProps } from 'react'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Checkmark } from 'ui/svg/icons/Checkmark'
import { Typo } from 'ui/theme'

export const SearchTab: FC<ComponentProps<typeof StyledSearchFilterTab> & { title: string }> = ({
  isSelected,
  title,
  ...props
}) => {
  return (
    <StyledSearchFilterTab isSelected={isSelected} {...props}>
      {isSelected ? <Checkmark /> : null}
      <Typo.BodyAccentXs>{title}</Typo.BodyAccentXs>
    </StyledSearchFilterTab>
  )
}

const StyledSearchFilterTab = styled(TouchableOpacity)<{ isSelected: boolean }>(
  ({ theme, isSelected }) => ({
    borderWidth: 1,
    borderColor: theme.designSystem.color.border.subtle,
    borderRadius: theme.designSystem.size.borderRadius.xxl,
    paddingVertical: theme.designSystem.size.spacing.xs,
    paddingHorizontal: theme.designSystem.size.spacing.l,
    alignItems: 'center',
    flexDirection: 'row',

    ...(isSelected && {
      borderWidth: 2,
      borderColor: theme.designSystem.color.border.selected,
      backgroundColor: theme.designSystem.color.background.disabled,
      gap: theme.designSystem.size.spacing.xs,
    }),
  })
)
