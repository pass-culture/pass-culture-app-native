import React, { FC, ReactElement, ReactNode } from 'react'
import styled from 'styled-components/native'

import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'

interface Props {
  items: ReactNode[]
  Separator?: ReactElement
  withPadding?: boolean
}

export const AccessibleUnorderedList: FC<Props> = ({ items, Separator, withPadding = false }) => {
  const itemListLength = items.length
  return (
    <StyledVerticalUl withPadding={withPadding}>
      {items.map((item, index) => {
        return (
          <Li key={index}>
            {item}
            {index < itemListLength - 1 && Separator}
          </Li>
        )
      })}
    </StyledVerticalUl>
  )
}

const StyledVerticalUl = styled(VerticalUl)<{ withPadding?: boolean }>(
  ({ theme, withPadding }) => ({
    width: '100%',
    padding: withPadding ? theme.designSystem.size.spacing.xs : 0,
  })
)
