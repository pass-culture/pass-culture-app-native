import React, { FC } from 'react'
import styled from 'styled-components/native'

import { GenreType, SearchGroupNameEnumv2 } from 'api/gen'
import { CategoriesSectionItem } from 'features/search/components/CategoriesSectionItem/CategoriesSectionItem'
import {
  MappedGenreTypes,
  MappedNativeCategories,
  MappingTree,
} from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { DescriptionContext } from 'features/search/types'
import { Li } from 'ui/components/Li'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Separator } from 'ui/components/Separator'
import { VerticalUl } from 'ui/components/Ul'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { Spacer, Typo } from 'ui/theme'

type CategoriesMapping = MappingTree | MappedNativeCategories | MappedGenreTypes

interface CategoriesSectionProps<
  T extends CategoriesMapping,
  N = T extends MappingTree ? keyof MappingTree : keyof T | null
> {
  allLabel: string
  allValue: N
  data?: T
  descriptionContext: DescriptionContext
  getIcon?: T extends MappingTree
    ? (categoryName: SearchGroupNameEnumv2) => FC<BicolorIconInterface> | undefined
    : undefined
  onSelect: (item: N) => void
  onSubmit?: () => void
  value: N
}

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
      {data
        ? Object.entries(data)
            .filter(
              ([_k, item]) => item.genreTypeKey === GenreType.BOOK && item.label !== 'Livres papier'
            )
            .map(([k, item]) => (
              <CategoriesSectionItem
                key={k}
                value={value}
                k={k}
                item={item}
                descriptionContext={descriptionContext}
                handleSelect={handleSelect}
                handleGetIcon={handleGetIcon}
              />
            ))
        : null}
      <Spacer.Column numberOfSpaces={3} />
      <Separator.Horizontal />
      <Spacer.Column numberOfSpaces={6} />
      <Title>{'Autres'}</Title>
      <Spacer.Column numberOfSpaces={3} />
      {data
        ? Object.entries(data)
            .filter(([_k, item]) => item.genreTypeKey !== GenreType.BOOK)
            .map(([k, item]) => (
              <CategoriesSectionItem
                key={k}
                value={value}
                k={k}
                item={item}
                descriptionContext={descriptionContext}
                handleSelect={handleSelect}
                handleGetIcon={handleGetIcon}
              />
            ))
        : null}
    </VerticalUl>
  )
}

const Title = styled(Typo.Title1)({})

const ListItem = styled(Li)({
  display: 'flex',
})
