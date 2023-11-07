import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useLocationForLocationWidgetDesktop } from 'features/location/components/useLocationForLocationWidgetDesktop'
import { SearchState } from 'features/search/types'
import { useModal } from 'ui/components/modals/useModal'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { LocationPointerNotFilled } from 'ui/svg/icons/LocationPointerNotFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export type LocationWidgetWrapperDesktopChildrenProps = {
  visible: boolean
  dismissModal: VoidFunction
}

export type LocationWidgetWrapperDesktopProps = {
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
}) => {
  const { icons } = useTheme()
  const {
    title: locationTitle,
    isWidgetHighlighted,
    testId,
  } = useLocationForLocationWidgetDesktop()

  const {
    visible: locationModalVisible,
    showModal: showLocationModal,
    hideModal: hideLocationModal,
  } = useModal()

  return (
    <React.Fragment>
      <LocationButton onPress={showLocationModal} testID={testId} accessibilityLabel={testId}>
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

const LocationButton = styled(TouchableOpacity)({
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
