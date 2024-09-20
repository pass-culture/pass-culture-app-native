import React from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import {
  getDescription,
  getNbResultsFacetLabel,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { DescriptionContext } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { Li } from 'ui/components/Li'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'
import { Spacer } from 'ui/theme'

type CategoriesMappingItem = {
  label: string
  nbResultsFacet?: number
  children?: CategoriesMappingItem[]
}

interface CategoriesSectionItemProps<N> {
  value: N
  k: string
  item: CategoriesMappingItem
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
  const displaySearchNbFacetResults = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_DISPLAY_SEARCH_NB_FACET_RESULTS
  )
  const shouldHideArrow =
    !item.children || Object.keys(item.children).length === 0 || item.children.length === 0
  const itemKey = k as N
  const nbResultsFacet = getNbResultsFacetLabel(item.nbResultsFacet)

  return (
    <ListItem>
      {shouldHideArrow ? (
        <RadioButton
          label={item.label}
          isSelected={itemKey === value}
          onSelect={() => handleSelect(itemKey)}
          icon={handleGetIcon(k as SearchGroupNameEnumv2)}
          complement={displaySearchNbFacetResults ? nbResultsFacet : undefined}
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
            complement={displaySearchNbFacetResults ? nbResultsFacet : undefined}
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
