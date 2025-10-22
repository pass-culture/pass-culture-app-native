/* eslint-disable */
// @ts-nocheck
// prettier-ignore
import { HomeView } from 'features/home/components/HomeView'
import { useHomeViewModel } from 'features/home/hooks/useHomeViewModel'
import React, { FunctionComponent } from 'react'

// ... (GenericHomeProps et autres types)

export const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(
  function OnlineHome(props) {
    const { Header, HomeBanner, modules, homeId, thematicHeader } = props

    const {
      enrichedModules,
      isFetchingNextPage,
      isLoading,
      isError,
      handleScroll,
      handleLoadMore,
      homeListHeaderProps,
    } = useHomeViewModel(modules, homeId, thematicHeader, Header, HomeBanner)

    return (
      <HomeView
        enrichedModules={enrichedModules}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        isError={isError}
        handleScroll={handleScroll}
        handleLoadMore={handleLoadMore}
        homeListHeaderProps={homeListHeaderProps}
      />
    )
  }
)