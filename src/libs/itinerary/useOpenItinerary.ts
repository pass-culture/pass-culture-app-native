import { useItinerary } from 'libs/itinerary/useItinerary'

export default function useOpenItinerary(
  latitude?: number | null,
  longitude?: number | null,
  beforeNavigate?: () => Promise<void>
) {
  const { availableApps, navigateTo } = useItinerary()

  const openItinerary = async () => {
    if (!latitude || !longitude) return
    await beforeNavigate?.()
    navigateTo({ latitude, longitude })
  }

  return {
    openItinerary,
    canOpenItinerary:
      latitude !== undefined && longitude !== undefined && availableApps !== undefined,
  }
}
