import { useCallback } from 'react'

export function useModalNavigation(hideFirstModal: () => void, showNextModal: () => void) {
  return useCallback(() => {
    hideFirstModal()
    setTimeout(() => showNextModal(), 500)
  }, [hideFirstModal, showNextModal])
}
