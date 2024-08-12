import { useEffect } from 'react'

import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'

import { useShareAppModalStore } from './useShareAppModalStore'

export type ShareAppModalTrigger = () => boolean

export const useShareAppModaleTrigger = (trigger: ShareAppModalTrigger) => {
  const {
    hasSeenShareAppModal,
    actions: { seeShareAppModal },
  } = useShareAppModalStore()
  const { showShareAppModal } = useShareAppContext()

  useEffect(() => {
    if (hasSeenShareAppModal || !trigger()) return
    showShareAppModal(ShareAppModalType.BENEFICIARY)
    seeShareAppModal()
  }, [hasSeenShareAppModal, seeShareAppModal, showShareAppModal, trigger])
}

export const defaultTrigger: ShareAppModalTrigger = () => false
