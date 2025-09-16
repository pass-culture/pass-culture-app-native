import React from 'react'
import { FlatList, FlatListProps, View } from 'react-native'

const keyExtractor = (item) => item?.offer?.id.toString()

export const ExpandingFlatList = <T,>({
  isLoading,
  renderSkeleton,
  data,
  renderItem,
  skeletonListLength = 3,
  ...props
}: FlatListProps<T> & {
  animationDuration?: number
  isLoading?: boolean
  skeletonListLength?: number
  renderSkeleton: FlatListProps<T>['renderItem']
}) => {
  if (isLoading) {
    return (
      <FlatList
        {...props}
        data={Array(skeletonListLength).fill(undefined)}
        renderItem={renderSkeleton}
      />
    )
  }

  return (
    <View style={{}}>
      <FlatList
        {...props}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        initialNumToRender={data?.length}
      />
    </View>
  )
}
