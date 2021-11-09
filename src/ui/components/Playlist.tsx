/* We use many `any` on purpose in this module, so we deactivate the following rule : */
/* eslint-disable @typescript-eslint/no-explicit-any */
import range from 'lodash/range'
import React, { useMemo, useRef, useState } from 'react'
import { FlatList, ListRenderItem, ListRenderItemInfo } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { BicolorArrowLeft } from 'ui/svg/icons/BicolorArrowLeft'
import { BicolorArrowRight } from 'ui/svg/icons/BicolorArrowRight'
import { ColorsEnum, getSpacing } from 'ui/theme'
import { ZIndex } from 'ui/theme/layers'

type ItemDimensions = { width: number; height: number }

type Direction = 'previous' | 'next'

export type RenderHeaderItem =
  | ((itemDimensions: ItemDimensions) => React.ReactElement<any>)
  | undefined
export type RenderFooterItem =
  | ((itemDimensions: ItemDimensions) => React.ReactElement<any>)
  | undefined
export type CustomListRenderItem<ItemT> = (
  info: ListRenderItemInfo<ItemT> & ItemDimensions
) => React.ReactElement | null

type Props = {
  data: any[]
  itemWidth: number
  itemHeight: number
  testID: string
  renderItem: CustomListRenderItem<any>
  renderHeader?: RenderHeaderItem
  renderFooter?: RenderFooterItem
  keyExtractor: ((item: any, index: number) => string) | undefined
  onEndReached?: () => void
}

function defaultKeyExtractor(item: any, index: number): string {
  return item.key || item.id || index.toString()
}

export const Playlist = (props: Props) => {
  const {
    data,
    itemWidth,
    itemHeight,
    testID,
    renderItem,
    renderHeader,
    renderFooter,
    keyExtractor = defaultKeyExtractor,
    onEndReached,
  } = props

  const { isTouch } = useTheme()

  const [playlistWidth, setPlaylistWidth] = useState(0)
  const [playlistStepIndex, setPlaylistStepIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  // We have to include these dummy objects for header and footer in the data array
  // in order to have the correct array length available for the scroll functions and renderItem
  // See also renderItemWithHeaderAndFooter(...)
  const dataWithHeaderAndFooter = useMemo(() => {
    if (renderHeader && renderFooter) return [{ dataHeader: true }, ...data, { dataFooter: true }]
    if (renderHeader) return [{ dataHeader: true }, ...data]
    if (renderFooter) return [...data, { dataFooter: true }]
    return data
  }, [data, renderHeader, renderFooter])

  const totalItemWidth = itemWidth + ITEM_SEPARATOR_WIDTH
  const nbOfItems = dataWithHeaderAndFooter.length
  const nbOfItemsDisplayed = Math.floor(playlistWidth / totalItemWidth)
  const { steps, nbOfSteps } = useMemo(() => getItemSteps(nbOfItems, nbOfItemsDisplayed), [
    nbOfItems,
    nbOfItemsDisplayed,
  ])

  // It is required to know the exact width of an item width and its offset if we want to use
  // FlatList's scrollToIndex() function.
  function getItemLayout(_data: any[] | null | undefined, index: number) {
    return { length: itemWidth, offset: totalItemWidth * index, index }
  }

  function keyExtractorWithHeaderAndFooter(item: any, index: number) {
    if (renderHeader && index === 0) return 'playlist-data-header'
    if (renderFooter && index === nbOfItems - 1) return 'playlist-data-footer'
    return keyExtractor(item, index)
  }

  function displayItems(direction: Direction) {
    setPlaylistStepIndex((previousStepIndex) => {
      if (!flatListRef.current) return previousStepIndex
      let stepIndex = 0
      if (direction === 'previous') stepIndex = Math.max(previousStepIndex - 1, 0)
      if (direction === 'next') stepIndex = Math.min(previousStepIndex + 1, nbOfSteps - 1)
      flatListRef.current.scrollToIndex({ index: steps[stepIndex], viewPosition: 0 })
      return stepIndex
    })
  }

  const renderItemWithHeaderAndFooter: ListRenderItem<any> = ({ item, index, separators }) => {
    if (renderHeader && index === 0) {
      return renderHeader({ height: itemHeight, width: itemWidth })
    }
    if (renderFooter && index === nbOfItems - 1) {
      return renderFooter({ height: itemHeight, width: itemWidth })
    }
    return renderItem({ item, index, separators, width: itemWidth, height: itemHeight })
  }

  const displayLeftScrollButtonForNotTouchDevice = !isTouch && playlistStepIndex > 0
  const displayRightScrollButtonForNotTouchDevice = !isTouch && playlistStepIndex < nbOfSteps - 1
  return (
    <FlatListContainer>
      {displayLeftScrollButtonForNotTouchDevice ? (
        <ScrollButtonForNotTouchDevice
          horizontalAlign="left"
          onPress={() => displayItems('previous')}>
          <BicolorArrowLeft size={22} />
        </ScrollButtonForNotTouchDevice>
      ) : null}
      {displayRightScrollButtonForNotTouchDevice ? (
        <ScrollButtonForNotTouchDevice horizontalAlign="right" onPress={() => displayItems('next')}>
          <BicolorArrowRight size={22} />
        </ScrollButtonForNotTouchDevice>
      ) : null}
      <FlatList
        onLayout={({ nativeEvent }) => {
          setPlaylistWidth(nativeEvent.layout.width)
        }}
        testID={testID}
        ref={flatListRef}
        scrollEnabled={isTouch}
        data={dataWithHeaderAndFooter}
        renderItem={renderItemWithHeaderAndFooter}
        keyExtractor={keyExtractorWithHeaderAndFooter}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={200}
        horizontal={true}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListHeaderComponent={HorizontalMargin}
        ListFooterComponent={HorizontalMargin}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
      />
    </FlatListContainer>
  )
}

function getItemSteps(nbOfItems: number, nbOfItemsDisplayed: number) {
  const steps = range(0, nbOfItems, nbOfItemsDisplayed)
  return { nbOfSteps: steps.length, steps }
}

const FlatListContainer = styled.View({ position: 'relative' })

const BUTTON_SIZE = getSpacing(10)
const ScrollButtonForNotTouchDevice = styled.TouchableOpacity<{
  horizontalAlign: 'left' | 'right'
}>((props) => ({
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 'auto',
  height: BUTTON_SIZE,
  width: BUTTON_SIZE,
  right: props.horizontalAlign === 'right' ? getSpacing(2) : 'auto',
  left: props.horizontalAlign === 'left' ? getSpacing(2) : 'auto',
  top: 0,
  bottom: 0,
  borderWidth: 1,
  borderRadius: BUTTON_SIZE / 2,
  borderColor: ColorsEnum.GREY_MEDIUM,
  backgroundColor: ColorsEnum.WHITE,
  zIndex: ZIndex.PLAYLIST_BUTTON,
}))

const HorizontalMargin = styled.View({ width: getSpacing(6) })

const ITEM_SEPARATOR_WIDTH = getSpacing(4)
const ItemSeparatorComponent = styled.View({ width: ITEM_SEPARATOR_WIDTH })
