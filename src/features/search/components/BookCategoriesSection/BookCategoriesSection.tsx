import React from 'react'
import styled from 'styled-components/native'

import { GenreType, SearchGroupNameEnumv2 } from 'api/gen'
import {
  CategoriesMapping,
  CategoriesSectionProps,
} from 'features/search/components/CategoriesSection/CategoriesSection'
import { CategoriesSectionItem } from 'features/search/components/CategoriesSectionItem/CategoriesSectionItem'
import { MappingTree } from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { Li } from 'ui/components/Li'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Separator } from 'ui/components/Separator'
import { VerticalUl } from 'ui/components/Ul'
import { Spacer, Typo } from 'ui/theme'

export function BookCategoriesSection<
  T extends CategoriesMapping,
  N = T extends MappingTree ? keyof MappingTree : keyof T | null
>({
  allLabel,
  allValue,
  data,
  descriptionContext,
  getIcon,
  onSelect,
  onSubmit,
  value,
}: CategoriesSectionProps<T, N>) {
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

  const categories = data ? Object.entries(data) : []
  const bookCategoriesWithGenre = categories.filter(
    ([_k, item]) => item.genreTypeKey === GenreType.BOOK && item.label !== 'Livres papier'
  )
  const otherBookCategories = categories.filter(
    ([_k, item]) => item.genreTypeKey !== GenreType.BOOK
  )

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
      <Spacer.Column numberOfSpaces={6} />
      <Title>{'Livres papier'}</Title>
      <Spacer.Column numberOfSpaces={3} />
      {bookCategoriesWithGenre.map(([k, item]) => (
        <CategoriesSectionItem
          key={k}
          value={value}
          k={k}
          item={item}
          descriptionContext={descriptionContext}
          handleSelect={handleSelect}
          handleGetIcon={handleGetIcon}
        />
      ))}
      <Spacer.Column numberOfSpaces={3} />
      <Separator.Horizontal />
      <Spacer.Column numberOfSpaces={6} />
      <Title>{'Autres'}</Title>
      <Spacer.Column numberOfSpaces={3} />
      {otherBookCategories.map(([k, item]) => (
        <CategoriesSectionItem
          key={k}
          value={value}
          k={k}
          item={item}
          descriptionContext={descriptionContext}
          handleSelect={handleSelect}
          handleGetIcon={handleGetIcon}
        />
      ))}
    </VerticalUl>
  )
}

const Title = styled(Typo.Title1)({})

const ListItem = styled(Li)({
  display: 'flex',
})
