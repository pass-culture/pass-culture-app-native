import { StackNavigationOptions, TransitionPresets, TransitionSpecs } from '@react-navigation/stack'

export const FILTERS_MODAL_NAV_OPTIONS: StackNavigationOptions = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
  cardOverlayEnabled: true,
  transitionSpec: {
    open: {
      animation: 'spring',
      config: { ...TransitionSpecs.TransitionIOSSpec.config, mass: 2, damping: 83 },
    },
    close: { ...TransitionSpecs.BottomSheetSlideOutSpec },
  },
  cardStyleInterpolator: ({ current, layouts }) => ({
    overlayStyle: {
      backgroundColor: 'black',
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.7],
        extrapolate: 'clamp',
      }),
    },
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.height, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
    },
  }),
}
