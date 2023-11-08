import React, { useCallback, useEffect } from 'react'
import { LayoutChangeEvent, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useLocationForLocationWidgetDesktop } from 'features/location/components/useLocationForLocationWidgetDesktop'
import { ScreenOrigin } from 'features/location/enums'
import { SearchState } from 'features/search/types'
import { storage } from 'libs/storage'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useModal } from 'ui/components/modals/useModal'
import { Tooltip } from 'ui/components/Tooltip'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { LocationPointerNotFilled } from 'ui/svg/icons/LocationPointerNotFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const TOOLTIP_WIDTH = getSpacing(58)
const WIDGET_HEIGHT = getSpacing(5 + 1) // textSize + padding

type LocationWidgetWrapperDesktopChildrenProps = {
  visible: boolean
  dismissModal: VoidFunction
}

type LocationWidgetWrapperDesktopProps = {
  screenOrigin: ScreenOrigin
  children: ({
    visible,
    dismissModal,
  }: LocationWidgetWrapperDesktopChildrenProps) => React.ReactNode
}

export type SearchLocationWidgetDesktopProps = {
  onSearch: (payload: Partial<SearchState>) => void
}

/**
 * The UI is the same so we just need a children as function
 * that will use modal props defined in
 * -> so children has to be a modal
 */
export const LocationWidgetWrapperDesktop: React.FC<LocationWidgetWrapperDesktopProps> = ({
  children,
  screenOrigin,
}) => {
  const touchableRef = React.useRef<HTMLButtonElement>()

  const { icons } = useTheme()
  const {
    title: locationTitle,
    isWidgetHighlighted,
    testId,
    userPosition,
  } = useLocationForLocationWidgetDesktop()

  const {
    visible: locationModalVisible,
    showModal: showLocationModal,
    hideModal: hideLocationModal,
  } = useModal()

  const [widgetWidth, setWidgetWidth] = React.useState<number | undefined>()
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false)
  const hideTooltip = useCallback(() => setIsTooltipVisible(false), [setIsTooltipVisible])

  // native resizing on layout
  function onWidgetLayout(event: LayoutChangeEvent) {
    const { width } = event.nativeEvent.layout
    setWidgetWidth(width)
  }

  // web resizing on layout
  useEffect(() => {
    if (Platform.OS === 'web' && touchableRef.current) {
      const { width } = touchableRef.current.getBoundingClientRect()
      setWidgetWidth(width)
    }
  }, [])

  const enableTooltip = screenOrigin === ScreenOrigin.HOME

  useEffect(() => {
    if (!enableTooltip) return

    const displayTooltipIfNeeded = async () => {
      const timesLocationTooltipHasBeenDisplayed = Number(
        await storage.readString('times_location_tooltip_has_been_displayed')
      )
      setIsTooltipVisible(timesLocationTooltipHasBeenDisplayed < 1 || !userPosition)
      await storage.saveString(
        'times_location_tooltip_has_been_displayed',
        String(timesLocationTooltipHasBeenDisplayed + 1)
      )
    }
    const timeoutOn = setTimeout(displayTooltipIfNeeded, 1000)
    const timeoutOff = setTimeout(hideTooltip, 9000)

    return () => {
      clearTimeout(timeoutOn)
      clearTimeout(timeoutOff)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- should only be called on startup
  }, [])

  return (
    <React.Fragment>
      {enableTooltip ? (
        <StyledTooltip
          label="Configure ta position et découvre les offres dans la zone géographique de ton choix."
          isVisible={isTooltipVisible}
          onHide={hideTooltip}
          widgetWidth={widgetWidth}
        />
      ) : null}
      <LocationButton
        {...(Platform.OS === 'web' ? { ref: touchableRef } : { onLayout: onWidgetLayout })}
        onPress={showLocationModal}
        testID={testId}
        accessibilityLabel={testId}>
        <NotShrunk>
          {isWidgetHighlighted ? (
            <LocationPointerFilled size={icons.sizes.extraSmall} testID="location pointer filled" />
          ) : (
            <SmallLocationPointerNotFilled
              size={icons.sizes.extraSmall}
              testID="location pointer not filled"
            />
          )}
        </NotShrunk>
        <Spacer.Row numberOfSpaces={1} />
        <LocationTitle>{locationTitle}</LocationTitle>
        <Spacer.Row numberOfSpaces={2} />
        <NotShrunk>
          <ArrowDown size={icons.sizes.extraSmall} />
        </NotShrunk>
      </LocationButton>
      {children({ visible: locationModalVisible, dismissModal: hideLocationModal })}
    </React.Fragment>
  )
}

const StyledTooltip = styled(Tooltip)<{ widgetWidth?: number }>(({ theme, widgetWidth }) => ({
  position: 'absolute',
  top: WIDGET_HEIGHT + getSpacing(2),
  left: (widgetWidth ?? 0) / 2,
  zIndex: theme.zIndex.header,
  width: TOOLTIP_WIDTH,
}))

const LocationButton = styledButton(Touchable)({
  flexDirection: 'row',
  alignItems: 'center',
  height: getSpacing(8),
  flexShrink: 1,
})

const NotShrunk = styled.View({
  // We set to undefined to avoid shrink to be applied on the icons - otherwise their size is modified
  flexShrink: undefined,
})

const LocationPointerFilled = styled(LocationPointer).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))({})

const SmallLocationPointerNotFilled = styled(LocationPointerNotFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const LocationTitle = styled(Typo.ButtonText).attrs({
  numberOfLines: 1,
})({
  flexShrink: 1,
})
