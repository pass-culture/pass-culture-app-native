import { useCallback } from 'react'

export function useModalNavigation(hideFirstModal: () => void, showNextModal: () => void) {
  return useCallback(() => {
    hideFirstModal()
    showNextModal()
  }, [hideFirstModal, showNextModal])
}
