import React, { FC } from 'react'

import { CategoriesSectionItem } from 'features/search/components/CategoriesSectionItem/CategoriesSectionItem'
import { BaseCategory } from 'features/search/helpers/categoriesHelpers/categories'
import styled from 'styled-components/native'
import { Li } from 'ui/components/Li'
import { Separator } from 'ui/components/Separator'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'
import { Spacer, TypoDS } from 'ui/theme'

interface CategoriesSectionBlockProps {
  getIcon: (categoryKey: string) => FC<AccessibleBicolorIcon> | undefined
  items: BaseCategory[]
  onSelect: (category: BaseCategory) => void
  selectionKey?: string
  selectionSubtitle?: string
  title: string
}

export const CategoriesSectionBlock = ({
  getIcon,
  items,
  onSelect,
  selectionKey,
  selectionSubtitle,
  title,
}: CategoriesSectionBlockProps) => {
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={3} />
      <ListItem>
        <Title>{title}</Title>
      </ListItem>
      <Spacer.Column numberOfSpaces={3} />
      {items.map((item) => (
        <CategoriesSectionItem
          isSelected={selectionKey === item.key}
          item={item}
          key={item.key}
          onSelect={() => onSelect(item)}
          icon={getIcon(item.key)}
          subtitle={selectionKey === item.key ? selectionSubtitle : undefined}
        />
      ))}
      <Spacer.Column numberOfSpaces={3} />
      <Separator.Horizontal />
      <Spacer.Column numberOfSpaces={3} />
    </React.Fragment>
  )
}

const ListItem = styled(Li)({
  display: 'flex',
})

const Title = styled(TypoDS.Title1)({})
