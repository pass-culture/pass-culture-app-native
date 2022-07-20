import { MutableRefObject, useCallback, useEffect } from 'react'

export const useArrowNavigationForRadioButton = (containerRef: MutableRefObject<null>) => {
  const focusElement = useCallback(
    (e: Event) => {
      if (!containerRef.current) return
      const htmlRef = containerRef.current as unknown as HTMLDivElement
      const listItem = htmlRef.parentNode?.parentNode
      const buttonList = listItem?.parentNode?.childNodes

      const key = (e as KeyboardEvent).key
      switch (key) {
        case 'ArrowUp':
        case 'ArrowLeft': {
          e.preventDefault()
          const prevButton = listItem?.previousSibling?.firstChild
          if (prevButton) {
            return (prevButton as HTMLElement).focus()
          } else if (buttonList) {
            return (buttonList[buttonList.length - 1].firstChild as HTMLElement).focus()
          }
          break
        }
        case 'ArrowDown':
        case 'ArrowRight': {
          e.preventDefault()
          const nextButton = listItem?.nextSibling?.firstChild
          if (nextButton) {
            return (nextButton as HTMLElement).focus()
          } else if (buttonList) {
            return (buttonList[0].firstChild as HTMLElement).focus()
          }
        }
      }
    },
    [containerRef]
  )

  useEffect(() => {
    let radioButton: ParentNode | null = null
    if (containerRef.current) {
      const htmlRef = containerRef.current as unknown as HTMLDivElement
      radioButton = htmlRef.parentNode
      radioButton?.addEventListener('keydown', focusElement)
    }

    return () => {
      radioButton?.removeEventListener('keydown', focusElement)
    }
  }, [containerRef, focusElement])
}
