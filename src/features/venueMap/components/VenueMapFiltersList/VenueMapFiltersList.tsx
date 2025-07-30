import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { VenueMapFiltersModalStackParamList } from 'features/navigation/VenueMapFiltersStackNavigator/types'
import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { filterGroups } from 'features/venueMap/constant'
import { getFilterDescription } from 'features/venueMap/helpers/getFilterDescription/getFilterDescription'
import { VenueMapFiltersModal } from 'features/venueMap/pages/modals/VenueMapFiltersModal/VenueMapFiltersModal'
import { useVenuesFilter } from 'features/venueMap/store/venuesFilterStore'
import { FilterGroupData } from 'features/venueMap/types'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'

type Props = StackScreenProps<VenueMapFiltersModalStackParamList, 'VenueMapFiltersList'>

const titleId = uuidv4()

export const VenueMapFiltersList: FunctionComponent<Props> = ({ navigation }) => {
  const venueFilters = useVenuesFilter()

  const onPress = (item: FilterGroupData) => {
    navigation.navigate('VenueMapTypeFilter', { title: item.label, filterGroup: item.id })
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
        {filterGroups.map((item, index) => (
          <StyledLi key={item.label}>
            {index === 0 ? null : <Separator />}
            <FilterRow
              icon={item.icon}
              title={item.label}
              onPress={() => onPress(item)}
              description={
                venueFilters.length > 0 ? getFilterDescription(item.id, venueFilters) : 'Tout'
              }
            />
          </StyledLi>
        ))}
      </StyledUl>
    </VenueMapFiltersModal>
  )
}

const StyledUl = styled(VerticalUl)(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.xl,
}))

const StyledLi = styled(Li)({
  display: 'flex',
})

const Separator = styled.View(({ theme }) => ({
  width: '100%',
  height: 2,
  backgroundColor: theme.designSystem.color.background.subtle,
  marginVertical: theme.designSystem.size.spacing.xl,
}))
