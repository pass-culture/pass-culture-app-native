import React, { createContext, FunctionComponent, useRef, useState } from 'react'

import { Check } from 'ui/svg/icons/Check'
import { Close } from 'ui/svg/icons/Close'
import { Warning } from 'ui/svg/icons/Warning'
import { ColorsEnum } from 'ui/theme'

import { SnackBar, SnackBarProps } from './SnackBar'

export type SnackBarSettings = Omit<SnackBarProps, 'visible'>
export type SnackBarHelperSettings = Omit<SnackBarSettings, 'icon' | 'color' | 'backgroundColor'>

interface SnackBarContextValue {
  displaySuccessSnackBar: (props: SnackBarHelperSettings) => void
  displayInfosSnackBar: (props: SnackBarHelperSettings) => void
  displayDangerSnackBar: (props: SnackBarHelperSettings) => void
  hideSnackBar: () => void
}

export const SnackBarContext = createContext<SnackBarContextValue>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  displaySuccessSnackBar() {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  displayInfosSnackBar() {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  displayDangerSnackBar() {},
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
    color: ColorsEnum.WHITE,
  })

  const popup = (settings: SnackBarSettings) => setSnackBarProps({ ...settings, visible: true })
  const hide = () => setSnackBarProps((props) => ({ ...props, visible: false }))

  const snackBarToolsRef = useRef<SnackBarContextValue>({
    hideSnackBar: hide,
    displaySuccessSnackBar(settings) {
      popup({
        ...settings,
        icon: Check,
        backgroundColor: ColorsEnum.GREEN_VALID,
        color: ColorsEnum.WHITE,
      })
    },
    displayInfosSnackBar(settings) {
      popup({
        ...settings,
        icon: Warning,
        backgroundColor: ColorsEnum.ACCENT,
        color: ColorsEnum.WHITE,
      })
    },
    displayDangerSnackBar(settings) {
      popup({
        ...settings,
        icon: Close,
        backgroundColor: ColorsEnum.ERROR,
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
          color={snackBarProps.color}
        />
        {children}
      </SnackBarContext.Provider>
    </React.Fragment>
  )
}
