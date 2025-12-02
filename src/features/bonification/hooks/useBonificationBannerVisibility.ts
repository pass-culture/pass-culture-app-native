import {
  hasClosedBonificationBannerActions,
  useHasClosedBonificationBanner,
} from 'features/bonification/store/hasClosedBonificationBannerStore'

export const useBonificationBannerVisibility = () => {
  const { setHasClosedBonificationBanner } = hasClosedBonificationBannerActions
  const { hasClosedBonificationBanner } = useHasClosedBonificationBanner()

  const onCloseBanner = () => {
    setHasClosedBonificationBanner(true)
  }

  return { hasClosedBonificationBanner, onCloseBanner }
}
