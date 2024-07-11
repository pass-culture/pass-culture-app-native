import { useContext } from 'react'

import { IconFactoryContext } from 'ui/components/icons/IconFactoryContext'

export const useIconFactory = () => useContext(IconFactoryContext)
