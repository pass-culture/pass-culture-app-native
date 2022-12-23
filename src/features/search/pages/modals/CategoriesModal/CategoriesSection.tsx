import React, { FC, useCallback } from 'react'
import styled from 'styled-components/native'

import {
  NativeCategoryResponseModelv2,
  SearchGroupNameEnumv2,
  SearchGroupResponseModelv2,
} from 'api/gen'
import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { CategoriesModalView } from 'features/search/enums'
import { getDescription, isCategory } from 'features/search/helpers/categoriesHelpers'
import { CategoriesViewData, DescriptionContext } from 'features/search/types'
import { Li } from 'ui/components/Li'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { VerticalUl } from 'ui/components/Ul'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer } from 'ui/theme'

export interface CategoriesSectionProps<
  T extends CategoriesViewData,
  N = T extends SearchGroupResponseModelv2 ? SearchGroupResponseModelv2 : T | null
> {
  /**
   * Used to compute data internally
   */
  view: T extends SearchGroupResponseModelv2
    ? CategoriesModalView.CATEGORIES
    : T extends NativeCategoryResponseModelv2
    ? CategoriesModalView.NATIVE_CATEGORIES
    : CategoriesModalView.GENRES
  /**
   * Collection to render.
   */
  items: T[]
  /**
   * Current value selected.
   */
  value: N
  /**
   * Handles value change, i.e. when user clicks a row.
   * @param nextValue
   */
  onChange: (nextValue: N) => void
  /**
   * Only for categories, since native categories do not have icons.
   */
  context: DescriptionContext
  allValue: N
  allLabel: string
  getIcon?: T extends SearchGroupResponseModelv2
    ? (categoryName: SearchGroupNameEnumv2) => FC<BicolorIconInterface>
    : undefined
}

export function CategoriesSection<T extends CategoriesViewData>({
  value,
  onChange,
  items,
  context,
  allValue,
  allLabel,
  view,
  getIcon,
}: CategoriesSectionProps<T>) {
  const getShouldHideArrow = useCallback(
    (item: T) => {
      // all categories have native categories
      if (view === CategoriesModalView.CATEGORIES) return false
      // all genre and types are final values
      if (view === CategoriesModalView.GENRES) return true

      // handle "CARTES JEUNES" case where it's the same value for category and native category
      if (isCategory(item)) return true
      // show radio button when there is no genre or type for native category
      return !(item as NativeCategoryResponseModelv2).genreType
    },
    [view]
  )

  const handleAllValueSelect = useCallback(() => onChange(allValue), [allValue, onChange])
  const handleValueSelect = (item: CategoriesViewData) => () => onChange(item as any)

  return (
    <VerticalUl>
      <ListItem>
        <RadioButton
          label={allLabel}
          isSelected={value?.name === allValue?.name}
          onSelect={handleAllValueSelect}
          marginVertical={getSpacing(3)}
          icon={getIcon ? getIcon(SearchGroupNameEnumv2.NONE) : undefined}
        />
      </ListItem>

      {items.map((item) => {
        const shouldHideArrow = getShouldHideArrow(item)

        return (
          <ListItem key={item.name}>
            <Spacer.Column numberOfSpaces={3} />
            {shouldHideArrow ? (
              <RadioButton
                label={item.value ?? 'Tout'}
                isSelected={value?.name === item.name}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSelect={handleValueSelect(item)}
                icon={getIcon && getIcon(item.name as SearchGroupNameEnumv2)}
              />
            ) : (
              <FilterRow
                icon={getIcon && getIcon(item.name as SearchGroupNameEnumv2)}
                shouldColorIcon
                title={item.value ?? 'Toutes les catégories'}
                description={getDescription(context, item)}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onPress={handleValueSelect(item)}
                captionId={item.name}
                shouldHideArrowOnWeb
              />
            )}
            <Spacer.Column numberOfSpaces={3} />
          </ListItem>
        )
      })}
    </VerticalUl>
  )
}

const ListItem = styled(Li)({
  display: 'flex',
})
