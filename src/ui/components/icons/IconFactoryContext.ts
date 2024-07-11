import { createContext } from 'react'

import { IconFactory } from 'ui/components/icons/iconFactory'

export const IconFactoryContext = createContext<IconFactory>({
  getIcon: () => {
    throw new Error('No <IconFactoryProvider> detected')
  },
} as IconFactory)
