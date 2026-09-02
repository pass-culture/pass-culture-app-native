import { RefObject, useEffect, useRef } from 'react'
import { View } from 'react-native'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

const isHTMLElement = (node: unknown): node is HTMLElement =>
  typeof HTMLElement !== 'undefined' && node instanceof HTMLElement

const getModalElement = (modalRef: RefObject<View | null>) => {
  const node = modalRef.current
  return isHTMLElement(node) ? node : null
}

const getFocusableElements = (modalElement: HTMLElement) => {
  const candidates = Array.from(
    modalElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter((element) => element.getAttribute('aria-hidden') !== 'true')

  const visibleCandidates = candidates.filter((element) => element.getClientRects().length > 0)
  return visibleCandidates.length > 0 ? visibleCandidates : candidates
}

export const useModalFocusTrap = (modalRef: RefObject<View | null>, isReady: boolean) => {
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement | null

    return () => {
      const trigger = triggerRef.current
      if (!trigger) return

      requestAnimationFrame(() => {
        if (document.body.contains(trigger)) {
          trigger.focus()
        } else if (trigger.id) {
          document.getElementById(trigger.id)?.focus()
        }
      })
    }
  }, [])

  useEffect(() => {
    if (isReady) getModalElement(modalRef)?.focus()
  }, [isReady, modalRef])

  useEffect(() => {
    if (!isReady) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const modalElement = getModalElement(modalRef)
      if (!modalElement) return

      const focusableElements = getFocusableElements(modalElement)
      if (focusableElements.length === 0) {
        event.preventDefault()
        modalElement.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)
      const { activeElement } = document

      if (event.shiftKey && (activeElement === firstElement || activeElement === modalElement)) {
        event.preventDefault()
        lastElement?.focus()
        return
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    const handleFocusIn = (event: FocusEvent) => {
      const modalElement = getModalElement(modalRef)
      const target = event.target as HTMLElement | null
      if (!modalElement || !target || modalElement.contains(target)) return

      const isTargetInAnyModal = !!target.closest('[role="dialog"], [aria-modal="true"]')
      if (isTargetInAnyModal) return

      modalElement.focus()
    }

    globalThis.addEventListener('keydown', handleKeyDown)
    document.addEventListener('focusin', handleFocusIn)

    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('focusin', handleFocusIn)
    }
  }, [modalRef, isReady])
}
