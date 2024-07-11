import React, { PropsWithChildren } from 'react'

import { iconFactory } from 'ui/components/icons/iconFactory'
import { IconFactoryContext } from 'ui/components/icons/IconFactoryContext'

export const IconFactoryProvider = ({ children }: PropsWithChildren) => (
  <IconFactoryContext.Provider value={iconFactory}>{children}</IconFactoryContext.Provider>
)
