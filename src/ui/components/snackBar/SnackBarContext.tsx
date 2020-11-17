import React, { createContext, FunctionComponent, useCallback, useRef, useState } from 'react'

import { ColorsEnum } from 'ui/theme'

import { SnackBar, SnackBarProps } from './SnackBar'

export type SnackBarSettings = Omit<SnackBarProps, 'visible'>

interface SnackBarContextValue {
  displaySnackBar: (props: SnackBarSettings) => void
  hideSnackBar: () => void
}

export const SnackBarContext = createContext<SnackBarContextValue>({
  displaySnackBar() {
    /** Default function */
  },
  hideSnackBar() {
    /** Default function */
  },
})

export const SnackBarProvider: FunctionComponent = ({ children }) => {
  const [snackBarProps, setSnackBarProps] = useState<SnackBarProps>({
    visible: false,
    backgroundColor: ColorsEnum.TRANSPARENT,
    color: ColorsEnum.WHITE,
  })

  const popup = useCallback(
    (settings: SnackBarSettings) => setSnackBarProps({ ...settings, visible: true }),
    []
  )
  const hide = useCallback(() => setSnackBarProps((props) => ({ ...props, visible: false })), [])

  const snackBarToolsRef = useRef<SnackBarContextValue>({
    displaySnackBar: popup,
    hideSnackBar: hide,
  })

  return (
    <React.Fragment>
      <SnackBarContext.Provider value={snackBarToolsRef.current}>
        <SnackBar
          visible={snackBarProps.visible}
          message={snackBarProps?.message}
          icon={snackBarProps?.icon}
          onClose={snackBarProps?.onClose || hide}
          timeout={snackBarProps?.timeout}
          backgroundColor={snackBarProps?.backgroundColor}
          color={snackBarProps?.color}
        />
        {children}
      </SnackBarContext.Provider>
    </React.Fragment>
  )
}
