import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { BusinessModule, ExclusivityModule, OffersModule } from 'features/home/components'
import { HomeHeader } from 'features/home/components/HomeHeader'
import {
  BusinessPane,
  ExclusivityPane,
  OffersWithCover,
  ProcessedModule,
} from 'features/home/contentful'
import { useGeolocation } from 'libs/geolocation'
import { SearchHit } from 'libs/search'
import { Spacer } from 'ui/theme'

import { useUserProfileInfo } from '../api'
import { RecommendationPane } from '../contentful/moduleTypes'
import { HomeModuleResponse } from '../pages/useHomeModules'
import { isOfferModuleTypeguard } from '../typeguards'

import { RecommendationModule } from './RecommendationModule'

interface HomeBodyProps {
  modules: ProcessedModule[]
  homeModules: HomeModuleResponse
  recommendedHits: SearchHit[]
  setRecommendationY: (y: number) => void
  onScroll: (input: any) => void
}

const keyExtractor = (item: ProcessedModule, index: number) =>
  'moduleId' in item ? item.moduleId : `recommendation${index}`

const ItemSeparatorComponent = () => <Spacer.Column numberOfSpaces={6} />

const ListHeaderComponent = () => (
  <Container>
    <Spacer.TopScreen />
    <HomeHeader />
  </Container>
)

export const HomeBody = (props: HomeBodyProps) => {
  const { modules, homeModules, recommendedHits, setRecommendationY } = props
  const { position } = useGeolocation()
  const { data: profile } = useUserProfileInfo()

  const renderModule = useCallback(
    ({ item, index }: { item: ProcessedModule; index: number }) => {
      if (isOfferModuleTypeguard(item)) {
        const { hits, nbHits } = homeModules[item.moduleId]
        return (
          <OffersModule
            key={item.moduleId}
            search={item.search[0]}
            display={item.display}
            isBeneficiary={profile?.isBeneficiary}
            position={position}
            hits={hits}
            nbHits={nbHits}
            cover={item instanceof OffersWithCover ? item.cover : null}
            index={index}
          />
        )
      }
      if (item instanceof RecommendationPane) {
        return (
          <RecommendationModule
            key={`recommendation${index}`}
            isBeneficiary={profile?.isBeneficiary}
            hits={recommendedHits}
            position={position}
            index={index}
            setRecommendationY={setRecommendationY}
            {...item}
          />
        )
      }
      if (item instanceof ExclusivityPane) {
        return <ExclusivityModule key={item.moduleId} {...item} />
      }
      if (item instanceof BusinessPane) {
        return <BusinessModule key={item.moduleId} {...item} />
      }
      return null
    },
    [Object.keys(homeModules), position, recommendedHits]
  )

  return (
    <Container>
      <FlatList
        testID="homeBodyScrollView"
        scrollEventThrottle={400}
        bounces={false}
        onScroll={props.onScroll}
        data={modules}
        renderItem={renderModule}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={<Spacer.TabBar />}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
      <Spacer.Column numberOfSpaces={6} />
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
