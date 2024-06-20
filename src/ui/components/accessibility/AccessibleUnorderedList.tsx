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
          <React.Fragment key={index}>
            <Li>
              {item}
              {index < itemListLength - 1 && Separator}
            </Li>
          </React.Fragment>
        )
      })}
    </StyledVerticalUl>
  )
}

const StyledVerticalUl = styled(VerticalUl)({
  width: '100%',
})
