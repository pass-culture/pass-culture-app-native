import React, { createContext, FunctionComponent, useRef, useState } from 'react'

import { Check } from 'ui/svg/icons/Check'
import { Warning } from 'ui/svg/icons/Warning'
import { ColorsEnum } from 'ui/theme'

import { SnackBar, SnackBarProps } from './SnackBar'
import { SnackBarHelperSettings, SnackBarSettings } from './types'

interface SnackBarContextValue {
  displaySuccessSnackBar: (props: SnackBarHelperSettings) => void
  displayInfosSnackBar: (props: SnackBarHelperSettings) => void
  hideSnackBar: () => void
}

export const SnackBarContext = createContext<SnackBarContextValue>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  displaySuccessSnackBar() {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  displayInfosSnackBar() {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  hideSnackBar() {},
})

export const SnackBarProvider: FunctionComponent = ({ children }) => {
  const [snackBarProps, setSnackBarProps] = useState<SnackBarProps>({
    visible: false,
    message: '',
    onClose: undefined,
    icon: undefined,
    backgroundColor: ColorsEnum.TRANSPARENT,
    progressBarColor: ColorsEnum.TRANSPARENT,
    color: ColorsEnum.WHITE,
    refresher: 0,
  })

  const popup = (settings: SnackBarSettings) =>
    setSnackBarProps({ ...settings, visible: true, refresher: new Date().getTime() })
  const hide = () =>
    setSnackBarProps((props) => ({ ...props, visible: false, refresher: new Date().getTime() }))

  const snackBarToolsRef = useRef<SnackBarContextValue>({
    hideSnackBar: hide,
    displaySuccessSnackBar(settings) {
      popup({
        ...settings,
        icon: Check,
        backgroundColor: ColorsEnum.GREEN_VALID,
        progressBarColor: ColorsEnum.GREEN_LIGHT,
        color: ColorsEnum.WHITE,
      })
    },
    displayInfosSnackBar(settings) {
      popup({
        ...settings,
        icon: Warning,
        backgroundColor: ColorsEnum.ACCENT,
        progressBarColor: ColorsEnum.WHITE,
        color: ColorsEnum.WHITE,
      })
    },
  })

  return (
    <React.Fragment>
      <SnackBarContext.Provider value={snackBarToolsRef.current}>
        <SnackBar
          visible={snackBarProps.visible}
          message={snackBarProps.message}
          icon={snackBarProps.icon}
          onClose={snackBarProps.onClose || hide}
          timeout={snackBarProps.timeout}
          backgroundColor={snackBarProps.backgroundColor}
          progressBarColor={snackBarProps.progressBarColor}
          color={snackBarProps.color}
          refresher={snackBarProps.refresher}
        />
        {children}
      </SnackBarContext.Provider>
    </React.Fragment>
  )
}
