import React from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { getDescription } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { DescriptionContext } from 'features/search/types'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { Li } from 'ui/components/Li'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'
import { Spacer } from 'ui/theme'
import { CategoryNode } from 'features/search/helpers/categoriesHelpers/categoryTree'

interface CategoriesSectionItemProps<N> {
  value: N
  k: string
  item: CategoryNode
  descriptionContext: DescriptionContext
  handleSelect: (key: N) => void
  handleGetIcon: (category: SearchGroupNameEnumv2) => React.FC<AccessibleBicolorIcon> | undefined
}

export const CategoriesSectionItem = <N,>({
  value,
  k,
  item,
  descriptionContext,
  handleSelect,
  handleGetIcon,
}: CategoriesSectionItemProps<N>) => {
  const { data: subcategoriesData } = useSubcategories()
  const shouldHideArrow = !item.children || Object.keys(item.children).length === 0
  const itemKey = k as N

  return (
    <ListItem>
      {shouldHideArrow ? (
        <RadioButton
          label={item.label}
          isSelected={itemKey === value}
          onSelect={() => handleSelect(itemKey)}
          icon={handleGetIcon(k as SearchGroupNameEnumv2)}
        />
      ) : (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={3} />
          <FilterRow
            icon={handleGetIcon(k as SearchGroupNameEnumv2)}
            shouldColorIcon
            title={item.label}
            description={getDescription(subcategoriesData, descriptionContext, k)}
            onPress={() => handleSelect(itemKey)}
            captionId={k}
          />
          <Spacer.Column numberOfSpaces={3} />
        </React.Fragment>
      )}
    </ListItem>
  )
}

const ListItem = styled(Li)({
  display: 'flex',
})
