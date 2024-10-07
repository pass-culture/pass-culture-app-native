import React from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CategoriesSectionProps } from 'features/search/components/CategoriesSection/CategoriesSection'
import { CategoriesSectionItem } from 'features/search/components/CategoriesSectionItem/CategoriesSectionItem'
import { Li } from 'ui/components/Li'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Separator } from 'ui/components/Separator'
import { VerticalUl } from 'ui/components/Ul'
import { Spacer, Typo } from 'ui/theme'
import { CategoryNode } from 'features/search/helpers/categoriesHelpers/categoryTree'

export function BookCategoriesSection<CategoryTree, N = keyof CategoryTree | null>({
  allLabel,
  allValue,
  data,
  descriptionContext,
  getIcon,
  onSelect,
  onSubmit,
  value,
}: CategoriesSectionProps<CategoryTree, N>) {
  const handleGetIcon = (category: SearchGroupNameEnumv2) => {
    if (getIcon) {
      return getIcon(category)
    }

    return undefined
  }

  const handleSelect = (key: N) => {
    onSelect(key)
    if (onSubmit) {
      onSubmit()
    }
  }

  const paperBooks =
    data &&
    Object.entries<CategoryNode>(data)
      .filter(([_k, item]) => item?.gtls)
      .map((category) => category[1])
  const otherBookCategories =
    data &&
    Object.entries<CategoryNode>(data)
      .filter(([key, item]) => key !== 'LIVRES_PAPIER' && !item.gtls)
      .map((category) => category[1])

  return (
    <VerticalUl>
      <ListItem>
        <RadioButton
          label={allLabel}
          isSelected={value === allValue}
          onSelect={() => onSelect(allValue)}
          icon={handleGetIcon(SearchGroupNameEnumv2.NONE)}
        />
      </ListItem>
      <Spacer.Column numberOfSpaces={3} />
      <Title>{'Livres papier'}</Title>
      <Spacer.Column numberOfSpaces={3} />
      {paperBooks
        ? paperBooks.map((item) => {
            return (
              <CategoriesSectionItem
                key={item.id}
                value={value}
                k={item.id}
                item={item}
                descriptionContext={descriptionContext}
                handleSelect={handleSelect}
                handleGetIcon={handleGetIcon}
              />
            )
          })
        : null}
      <Spacer.Column numberOfSpaces={3} />
      <Separator.Horizontal />
      <Spacer.Column numberOfSpaces={6} />
      <Title>{'Autres'}</Title>
      <Spacer.Column numberOfSpaces={3} />
      {otherBookCategories
        ? otherBookCategories.map((item) => {
            return (
              <CategoriesSectionItem
                key={item.id}
                value={value}
                k={item.id}
                item={item}
                descriptionContext={descriptionContext}
                handleSelect={handleSelect}
                handleGetIcon={handleGetIcon}
              />
            )
          })
        : null}
    </VerticalUl>
  )
}

const Title = styled(Typo.Title1)({})

const ListItem = styled(Li)({
  display: 'flex',
})
