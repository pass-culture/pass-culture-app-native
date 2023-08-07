import { HandleNavigationWrapperProps } from 'ui/components/touchableLink/types'

export const handleNavigationWrapper = ({
  onBeforeNavigate,
  onAfterNavigate,
  handleNavigation,
}: HandleNavigationWrapperProps) => {
  const onClick = async (event: MouseEvent) => {
    if (event.metaKey || event.shiftKey || event.ctrlKey || event.altKey) return

    event.preventDefault()

    if (onBeforeNavigate) await onBeforeNavigate(event)
    handleNavigation()
    if (onAfterNavigate) await onAfterNavigate(event)
  }

  return onClick
}
