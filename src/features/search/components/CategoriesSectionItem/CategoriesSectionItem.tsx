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
  icon?: React.FC<AccessibleBicolorIcon>
  item: BaseCategory
  isSelected: boolean
  onSelect: VoidFunction
  subtitle?: string
}

export const CategoriesSectionItem = ({
  icon,
  isSelected,
  item,
  onSelect,
  subtitle,
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
          onSelect={onSelect}
          icon={icon}
          complement={nbResultsFacet}
        />
      ) : (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={3} />
          <FilterRow
            icon={icon}
            shouldColorIcon
            title={item.label}
            description={subtitle}
            onPress={onSelect}
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
