import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { CategoryBlock } from 'features/home/components/modules/categories/CategoryBlock'
import { getColorFilter } from 'features/home/components/modules/categories/helpers/getColorFilter'
import { CategoryBlock as CategoryBlockData } from 'features/home/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type CategoryListProps = {
  title: string
  categoryBlockList: CategoryBlockData[]
}

const keyExtractor = (_item: CategoryBlockData, index: number) => `category_block_#${index}`

const renderItem = ({ item, index }: { item: CategoryBlockData; index: number }) => (
  <CategoryBlockContainer index={index}>
    <CategoryBlock {...item} filter={getColorFilter(index)} />
  </CategoryBlockContainer>
)

const ListFooterComponent = () => <Spacer.Column numberOfSpaces={6} />

const ItemSeparatorComponent = () => <VerticalSeparator />

const ListHeaderComponent = (title: string) => (
  <React.Fragment>
    <Typo.Title3 numberOfLines={2}>{title}</Typo.Title3>
    <Spacer.Column numberOfSpaces={4} />
  </React.Fragment>
)

export const CategoryListModule = ({ title, categoryBlockList }: CategoryListProps) => {
  return (
    <FlatListContainer>
      <FlatList
        ListHeaderComponent={ListHeaderComponent(title)}
        ListFooterComponent={ListFooterComponent}
        data={categoryBlockList}
        numColumns={2}
        horizontal={false}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        scrollEnabled={false}
        keyExtractor={keyExtractor}
      />
    </FlatListContainer>
  )
}

const FlatListContainer = styled.View({
  marginHorizontal: getSpacing(6),
})

const CategoryBlockContainer = styled.View<{ index: number }>(({ index }) => ({
  flex: 0.5,
  marginRight: index % 2 === 0 ? getSpacing(2) : 0,
}))

const VerticalSeparator = styled.View({
  height: getSpacing(2),
})
