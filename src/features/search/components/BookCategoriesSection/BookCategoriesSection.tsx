import React from 'react'
import styled from 'styled-components/native'

import { GenreType, SearchGroupNameEnumv2 } from 'api/gen'
import { CategoriesSectionProps } from 'features/search/components/CategoriesSection/CategoriesSection'
import { CategoriesSectionItem } from 'features/search/components/CategoriesSectionItem/CategoriesSectionItem'
import { MappingTree } from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { CategoriesMapping } from 'features/search/helpers/categoriesSectionHelpers/categoriesSectionHelpers'
import { Li } from 'ui/components/Li'
import { Separator } from 'ui/components/Separator'
import { VerticalUl } from 'ui/components/Ul'
import { RadioButton } from 'ui/designSystem/RadioButton/RadioButton'
import { Typo } from 'ui/theme'

export function BookCategoriesSection<
  T extends CategoriesMapping,
  N = T extends MappingTree ? keyof MappingTree : keyof T | null,
>({
  allLabel,
  allValue,
  itemsMapping,
  descriptionContext,
  getIcon,
  onSelect,
  onSubmit,
  value,
}: Readonly<CategoriesSectionProps<T, N>>) {
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

  const categories = itemsMapping ? Object.entries(itemsMapping) : []
  const bookCategoriesWithGenre = categories.filter(
    ([_k, item]) => item.genreTypeKey === GenreType.BOOK && item.label !== 'Livres papier'
  )
  const otherBookCategories = categories.filter(
    ([_k, item]) => item.genreTypeKey !== GenreType.BOOK && item.label !== 'Livres papier'
  )

  return (
    <VerticalUl>
      <ListItem>
        <RadioButton
          label={allLabel}
          value={value === allValue ? allLabel : ''}
          setValue={() => onSelect(allValue)}
          variant="default"
          disabled={false}
          error={false}
        />
      </ListItem>
      <Title>{'Livres papier'}</Title>
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
      <StyledSeparator />
      <Title>{'Autres'}</Title>
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

const Title = styled(Typo.Title1)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.m,
}))

const ListItem = styled(Li)({
  display: 'flex',
})

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.m,
}))
