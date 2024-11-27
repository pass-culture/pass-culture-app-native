import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { VenueMapFiltersModalStackParamList } from 'features/navigation/VenueMapFiltersStackNavigator/types'
import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { VenueMapFiltersModal } from 'features/venueMap/pages/modals/VenueMapFiltersModal/VenueMapFiltersModal'
import { FilterItem } from 'features/venueMap/types'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { Store } from 'ui/svg/icons/bicolor/Store'
import { Show } from 'ui/svg/icons/Show'
import { Sort } from 'ui/svg/icons/Sort'
import { getSpacing } from 'ui/theme'

type Props = StackScreenProps<VenueMapFiltersModalStackParamList, 'VenueMapFiltersList'>

const filterItems: FilterItem[] = [
  { icon: Show, title: 'Sorties', description: 'Tout', filterGroup: 'OUTINGS' },
  { icon: Store, title: 'Boutiques', description: 'Tout', filterGroup: 'SHOPS' },
  { icon: Sort, title: 'Autres', description: 'Tout', filterGroup: 'OTHERS' },
]

const titleId = uuidv4()

export const VenueMapFiltersList: FunctionComponent<Props> = ({ navigation }) => {
  const onPress = (item: FilterItem) => {
    navigation.navigate('VenueMapTypeFilter', { title: item.title, filterGroup: item.filterGroup })
  }

  const onClose = () => {
    navigation.goBack()
  }

  return (
    <VenueMapFiltersModal
      titleId={titleId}
      title="Filtres"
      handleOnClose={onClose}
      shouldDisplayBackButton={false}
      shouldDisplayCloseButton>
      <StyledUl>
        {filterItems.map((item, index) => (
          <StyledLi key={item.title}>
            {index === 0 ? null : <Separator />}
            <FilterRow
              icon={item.icon}
              title={item.title}
              onPress={() => onPress(item)}
              description={item.description}
            />
          </StyledLi>
        ))}
      </StyledUl>
    </VenueMapFiltersModal>
  )
}

const StyledUl = styled(VerticalUl)({
  paddingTop: getSpacing(6),
})

const StyledLi = styled(Li)({
  display: 'flex',
})

const Separator = styled.View(({ theme }) => ({
  width: '100%',
  height: 2,
  backgroundColor: theme.colors.greyLight,
  marginVertical: getSpacing(4),
}))
