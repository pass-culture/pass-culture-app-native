import { ComponentType } from 'react'
import { LayoutChangeEvent } from 'react-native'

export type OnLayoutProps = { onLayout: (event: LayoutChangeEvent) => void }

/**
 * Defines the props passed to the `renderItem` prop.
 */
export type RenderItemProps<Item, AdditionalData> = {
  /**
   * The data that will be passed to each rendered item. It includes additional data.
   */
  data: OptimizedListData<Item, AdditionalData>
  /**
   * The index at which the item is rendered.
   */
  index: number
  /**
   * The item data currently rendered.
   */
  item: Item
}

export type OptimizedListData<Item, AdditionalData> = { items: Item[] } & AdditionalData

export type OptimizedListProps<Item, AdditionalData> = {
  /**
   * This list is optimized to render only items that are visible in the viewport.
   * To avoid computationally intensive operations, you must pass an `itemSize` property.
   */
  itemSize: number
  /**
   * The items that will be processed in a loop and passed to the `renderItem` function.
   */
  items: Item[]
  /**
   * Method that will be called to render every item, including Header and Footer components.
   * @param props Props passed to help you to develop your components.
   */
  renderItem: (props: RenderItemProps<Item, AdditionalData>) => JSX.Element | null
  /**
   * If `height` not passed, it will be computed to be full height.
   */
  height?: number
  /**
   * This additional data will be passed to every rendered item.
   */
  additionalData?: AdditionalData
  /**
   * Useful only for testing purposes.
   */
  testID?: string
  /**
   * Used to extract a unique key for a given item at the specified index.
   * Key is used for optimizing performance.
   *
   * Only used on mobile.
   *
   * @see https://shopify.github.io/flash-list/docs/usage#keyextractor
   *
   * @param item Current item in the loop
   * @param index Current item index
   */
  keyExtractor?: (item: Item, index: number) => string
  /**
   * The component that will be placed on top of other items.
   * Often used to show a header that contains a title.
   */
  headerComponent?: ComponentType<OnLayoutProps>
  /**
   * The component that will be placed below all other items.
   * Often used to show a footer that contains a loader/a button to load more.
   */
  footerComponent?: ComponentType<OnLayoutProps>
  /**
   * If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality.
   * Make sure to also set the refreshing prop correctly.
   *
   * Only used on mobile.
   * @see https://shopify.github.io/flash-list/docs/usage#onrefresh
   */
  onRefresh?: VoidFunction
  /**
   * Set this true while waiting for new data from a refresh.
   *
   * Only used on mobile.
   * @see https://shopify.github.io/flash-list/docs/usage#refreshing
   */
  refreshing?: boolean
  /**
   * Called once when the scroll position gets within onEndReachedThreshold of the rendered content.
   */
  onEndReached?: VoidFunction | (() => Promise<void>)
  /**
   * How far from the end (in units of visible length of the list) the bottom edge of the list
   * must be from the end of the content to trigger the onEndReached callback.
   * Thus, a value of 0.5 will trigger onEndReached when the end of the content is within half
   * the visible length of the list.
   */
  endReachedThreshold?: number
  /**
   * Event that is triggered when list is being scrolled.
   */
  onScroll?: (scrollOffset: number) => void
}

export type OptimizedListRef = {
  scrollToItem: (itemIndex: number) => void
}
