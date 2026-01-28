import React, { FC, ReactElement, ReactNode } from 'react'
import styled from 'styled-components/native'

import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'

interface Props {
  items: ReactNode[]
  Separator: ReactElement
}

export const AccessibleUnorderedList: FC<Props> = ({ items, Separator }) => {
  const itemListLength = items.length
  return (
    <StyledVerticalUl>
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

const StyledVerticalUl = styled(VerticalUl)(({ theme }) => ({
  width: '100%',
  padding: theme.designSystem.size.spacing.xs,
}))
