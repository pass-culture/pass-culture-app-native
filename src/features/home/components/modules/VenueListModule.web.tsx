import React, { FunctionComponent, useMemo } from 'react'
import { FlatList, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { VenueListModuleItem } from 'features/home/components/modules/VenueListModuleItem'
import { VenueHit } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { SeeMoreWithEye } from 'ui/components/SeeMoreWithEye'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

type ModuleProps = {
  moduleId: string
  moduleName: string
  homeVenuesListEntryId?: string
}

type Props = {
  venues: VenueHit[]
} & ModuleProps

const ListHeaderComponent: FunctionComponent<ModuleProps> = ({
  moduleId,
  moduleName,
  homeVenuesListEntryId,
}) => {
  const focusProps = useHandleFocus()

  const onPressSeeMore = () => {
    analytics.logClickSeeMore({
      moduleId,
      moduleName,
      from: 'venueList',
      homeEntryId: homeVenuesListEntryId,
    })
  }

  return (
    <StyledView {...focusProps}>
      <TypoDS.BodyAccentXs numberOfLines={1}>
        {'Les lieux culturels à proximité'.toUpperCase()}
      </TypoDS.BodyAccentXs>
      <SeeMoreWithEye
        title="liste des lieux"
        titleSeeMoreLink={{
          screen: 'ThematicHome',
          params: {
            homeId: homeVenuesListEntryId,
            from: 'venueList',
            moduleId,
          },
        }}
        onPressSeeMore={onPressSeeMore}
      />
    </StyledView>
  )
}

const keyExtractor: (item: VenueHit) => string = (item) => item.id.toString()

export const VenueListModule: FunctionComponent<Props> = ({
  venues,
  homeVenuesListEntryId,
  moduleId,
  moduleName,
}) => {
  const { isDesktopViewport } = useTheme()

  const { numColumns, columnWrapperStyle, FlatListComponent } = useMemo(() => {
    const numColumns = isDesktopViewport ? 2 : 1
    const columnWrapperStyle = numColumns > 1 ? { gap: getSpacing(6) } : undefined
    const FlatListComponent = isDesktopViewport ? DesktopFlatList : MobileFlatList
    return { numColumns, columnWrapperStyle, FlatListComponent }
  }, [isDesktopViewport])

  return (
    <FlatListComponent
      listAs="ul"
      itemAs="li"
      data={venues}
      key={`venueList-${numColumns}`}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => (
        <VenueListModuleItem
          item={item}
          moduleId={moduleId}
          homeVenuesListEntryId={homeVenuesListEntryId}
        />
      )}
      ListHeaderComponent={
        <ListHeaderComponent
          homeVenuesListEntryId={homeVenuesListEntryId}
          moduleId={moduleId}
          moduleName={moduleName}
        />
      }
      ItemSeparatorComponent={isDesktopViewport ? null : MobileSeparator}
      numColumns={numColumns}
      columnWrapperStyle={columnWrapperStyle}
    />
  )
}

const StyledFlatList = styled(FlatList as typeof FlatList<VenueHit>)(({ theme }) => ({
  backgroundColor: theme.colors.goldLight100,
  borderRadius: getSpacing(4),
  marginBottom: theme.home.spaceBetweenModules,
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const DesktopFlatList = styled(StyledFlatList)({
  paddingVertical: getSpacing(8),
  paddingHorizontal: getSpacing(10),
})

const MobileFlatList = styled(StyledFlatList)({
  paddingVertical: getSpacing(4),
  paddingHorizontal: getSpacing(4),
})

const StyledView = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
  gap: getSpacing(2),
  marginBottom: getSpacing(4),
})

const MobileSeparator = () => <Spacer.Column numberOfSpaces={8} />
