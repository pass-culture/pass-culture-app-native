/* We use many `any` on purpose in this module, so we deactivate the following rule : */
/* eslint-disable @typescript-eslint/no-explicit-any */
import range from 'lodash/range'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { FlatList, ListRenderItem, ListRenderItemInfo } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { BicolorArrowLeft } from 'ui/svg/icons/BicolorArrowLeft'
import { BicolorArrowRight } from 'ui/svg/icons/BicolorArrowRight'
import { ColorsEnum, getSpacing } from 'ui/theme'

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
  scrollButtonOffsetY?: number
  testID?: string
  renderItem: CustomListRenderItem<any>
  keyExtractor: (item: any, index: number) => string
  renderHeader?: RenderHeaderItem
  renderFooter?: RenderFooterItem
  onEndReached?: () => void
}

function defaultKeyExtractor(item: any, index: number): string {
  return item.key || item.id || index.toString()
}

const defaultProps = {
  keyExtractor: defaultKeyExtractor,
}

export const Playlist = (props: Props) => {
  const { isTouch } = useTheme()

  const [playlistWidth, setPlaylistWidth] = useState(0)
  const [playlistStepIndex, setPlaylistStepIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  // We have to include these dummy objects for header and footer in the data array
  // in order to have the correct array length available for the scroll functions and renderItem
  // See also renderItemWithHeaderAndFooter(...)
  const dataWithHeaderAndFooter = useMemo(() => {
    if (props.renderHeader && props.renderFooter)
      return [{ dataHeader: true }, ...props.data, { dataFooter: true }]
    if (props.renderHeader) return [{ dataHeader: true }, ...props.data]
    if (props.renderFooter) return [...props.data, { dataFooter: true }]
    return props.data
  }, [props.data, props.renderHeader, props.renderFooter])

  const itemWidthWithOffset = props.itemWidth + ITEM_SEPARATOR_WIDTH
  const nbOfItems = dataWithHeaderAndFooter.length
  const { steps, nbOfSteps } = useMemo(
    () => getItemSteps(nbOfItems, itemWidthWithOffset, playlistWidth),
    [nbOfItems, itemWidthWithOffset, playlistWidth]
  )

  // It is required to know the exact width of an item width and its offset if we want to use
  // FlatList's scrollToIndex() function.
  function getItemLayout(_data: any[] | null | undefined, index: number) {
    return { length: props.itemWidth, offset: itemWidthWithOffset * index, index }
  }

  const keyExtractorWithHeaderAndFooter = useCallback(
    function (item: any, index: number) {
      if (props.renderHeader && index === 0) return 'playlist-data-header'
      if (props.renderFooter && index === nbOfItems - 1) return 'playlist-data-footer'
      return props.keyExtractor(item, index)
    },
    [props.renderHeader, props.renderFooter, props.keyExtractor, nbOfItems]
  )

  const displayItems = useCallback(
    function (direction: Direction) {
      setPlaylistStepIndex((previousStepIndex) => {
        if (!flatListRef.current) return previousStepIndex
        let stepIndex = 0
        if (direction === 'previous') stepIndex = Math.max(previousStepIndex - 1, 0)
        if (direction === 'next') stepIndex = Math.min(previousStepIndex + 1, nbOfSteps - 1)
        flatListRef.current.scrollToIndex({ index: steps[stepIndex], viewPosition: 0 })
        return stepIndex
      })
    },
    [flatListRef.current, nbOfSteps, steps]
  )

  const renderItemWithHeaderAndFooter: ListRenderItem<any> = useCallback(
    function ({ item, index, separators }) {
      const { itemWidth: width, itemHeight: height } = props
      if (props.renderHeader && index === 0) {
        return props.renderHeader({ height, width })
      }
      if (props.renderFooter && index === nbOfItems - 1) {
        return props.renderFooter({ height, width })
      }
      return props.renderItem({ item, index, separators, width, height })
    },
    [nbOfItems, props.itemWidth, props.itemHeight]
  )

  const displayLeftScrollButtonForNotTouchDevice = !isTouch && playlistStepIndex > 0
  const displayRightScrollButtonForNotTouchDevice = !isTouch && playlistStepIndex < nbOfSteps - 1
  return (
    <FlatListContainer>
      {displayLeftScrollButtonForNotTouchDevice ? (
        <ScrollButtonForNotTouchDevice
          horizontalAlign="left"
          top={props.scrollButtonOffsetY}
          onPress={() => displayItems('previous')}>
          <BicolorArrowLeft size={22} />
        </ScrollButtonForNotTouchDevice>
      ) : null}
      {displayRightScrollButtonForNotTouchDevice ? (
        <ScrollButtonForNotTouchDevice
          horizontalAlign="right"
          top={props.scrollButtonOffsetY}
          onPress={() => displayItems('next')}>
          <BicolorArrowRight size={22} />
        </ScrollButtonForNotTouchDevice>
      ) : null}
      <FlatList
        onLayout={({ nativeEvent }) => {
          setPlaylistWidth(nativeEvent.layout.width)
        }}
        testID={props.testID}
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
        onEndReached={props.onEndReached}
        onEndReachedThreshold={0.2}
      />
    </FlatListContainer>
  )
}

Playlist.defaultProps = defaultProps

function getItemSteps(nbOfItems: number, itemWidth: number, playlistWidth: number) {
  if (!nbOfItems || !itemWidth || !playlistWidth) {
    return { nbOfSteps: 1, steps: [0] }
  }
  const nbOfItemsDisplayed = Math.floor(playlistWidth / itemWidth)
  const steps = range(0, nbOfItems, nbOfItemsDisplayed)
  return { nbOfSteps: steps.length, steps }
}

const FlatListContainer = styled.View({ position: 'relative' })

const BUTTON_SIZE = getSpacing(10)
const HALF_BUTTON_SIZE = BUTTON_SIZE / 2
const ScrollButtonForNotTouchDevice = styled.TouchableOpacity<{
  horizontalAlign: 'left' | 'right'
  top?: number
}>((props) => ({
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 'auto',
  height: BUTTON_SIZE,
  width: BUTTON_SIZE,
  right: props.horizontalAlign === 'right' ? getSpacing(2) : 'auto',
  left: props.horizontalAlign === 'left' ? getSpacing(2) : 'auto',
  top: props.top ? props.top - HALF_BUTTON_SIZE : 0,
  bottom: props.top ? 'auto' : 0,
  borderWidth: 1,
  borderRadius: HALF_BUTTON_SIZE,
  borderColor: ColorsEnum.GREY_MEDIUM,
  backgroundColor: ColorsEnum.WHITE,
  zIndex: props.theme.zIndex.playlistsButton,
}))

const HorizontalMargin = styled.View({ width: getSpacing(6) })

const ITEM_SEPARATOR_WIDTH = getSpacing(4)
const ItemSeparatorComponent = styled.View({ width: ITEM_SEPARATOR_WIDTH })
