import React, { createContext, memo, useContext, useRef, useState } from 'react'
import { useTheme } from 'styled-components/native'

import { mapSnackBarTypeToStyle } from './mapSnackBarTypeToStyle'
import { SnackBar, SnackBarProps } from './SnackBar'
import { SnackBarHelperSettings, SnackBarSettings, SnackBarType } from './types'

export const SNACK_BAR_TIME_OUT = 5000

interface SnackBarContextValue {
  showErrorSnackBar: (props: SnackBarHelperSettings) => void
  showInfoSnackBar: (props: SnackBarHelperSettings) => void
  showSuccessSnackBar: (props: SnackBarHelperSettings) => void
  hideSnackBar: () => void
}

const SnackBarContext = createContext<SnackBarContextValue>({
  showErrorSnackBar: () => null,
  showInfoSnackBar: () => null,
  showSuccessSnackBar: () => null,
  hideSnackBar: () => null,
})

export const SnackBarProvider = memo(function SnackBarProviderComponent({ children }) {
  const { colors } = useTheme()
  const [snackBarProps, setSnackBarProps] = useState<SnackBarProps>({
    visible: false,
    message: '',
    onClose: undefined,
    icon: undefined,
    backgroundColor: colors.transparent,
    progressBarColor: colors.transparent,
    color: colors.white,
    refresher: 0,
  })

  const showSnackBar = (settings: SnackBarSettings) =>
    setSnackBarProps({ ...settings, visible: true, refresher: new Date().getTime() })

  const hideSnackBar = () =>
    setSnackBarProps((props) => ({ ...props, visible: false, refresher: new Date().getTime() }))

  const snackBarToolsRef = useRef<SnackBarContextValue>({
    hideSnackBar,
    showErrorSnackBar: (settings) =>
      showSnackBar({
        ...settings,
        ...mapSnackBarTypeToStyle(SnackBarType.ERROR),
      }),
    showInfoSnackBar: (settings) =>
      showSnackBar({
        ...settings,
        ...mapSnackBarTypeToStyle(SnackBarType.INFO),
      }),
    showSuccessSnackBar: (settings) =>
      showSnackBar({
        ...settings,
        ...mapSnackBarTypeToStyle(SnackBarType.SUCCESS),
      }),
  })

  return (
    <SnackBarContext.Provider value={snackBarToolsRef.current}>
      <SnackBar
        visible={snackBarProps.visible}
        message={snackBarProps.message}
        icon={snackBarProps.icon}
        onClose={snackBarProps.onClose || hideSnackBar}
        timeout={snackBarProps.timeout}
        backgroundColor={snackBarProps.backgroundColor}
        progressBarColor={snackBarProps.progressBarColor}
        color={snackBarProps.color}
        refresher={snackBarProps.refresher}
      />
      {children}
    </SnackBarContext.Provider>
  )
})

export function useSnackBarContext(): SnackBarContextValue {
  return useContext(SnackBarContext)
}
