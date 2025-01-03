import React from 'react'
import styled from 'styled-components/native'

import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import {
  BaseCategory,
  getNbResultsFacetLabel,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Li } from 'ui/components/Li'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'
import { Spacer } from 'ui/theme'

interface CategoriesSectionItemProps {
  isSelected: boolean
  item: BaseCategory
  handleSelect: (item: BaseCategory) => void
  handleGetIcon: (item: BaseCategory) => React.FC<AccessibleBicolorIcon> | undefined
}

export const CategoriesSectionItem = ({
  isSelected,
  item,
  handleSelect,
  handleGetIcon,
}: CategoriesSectionItemProps) => {
  const displaySearchNbFacetResults = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_DISPLAY_SEARCH_NB_FACET_RESULTS
  )
  const nbResultsFacet = displaySearchNbFacetResults
    ? getNbResultsFacetLabel(item.nbResultsFacet)
    : undefined

  const shouldHideArrow = !item.children.length

  return (
    <ListItem>
      {shouldHideArrow ? (
        <RadioButton
          label={item.label}
          isSelected={isSelected}
          onSelect={() => handleSelect(item)}
          icon={handleGetIcon(item)}
          complement={nbResultsFacet}
        />
      ) : (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={3} />
          <FilterRow
            icon={handleGetIcon(item)}
            shouldColorIcon
            title={item.label}
            description={undefined}
            onPress={() => handleSelect(item)}
            captionId={item.key}
            complement={nbResultsFacet}
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
