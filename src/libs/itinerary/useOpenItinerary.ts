import { useItinerary } from 'libs/itinerary/useItinerary'

export default function useOpenItinerary(
  address?: string | null,
  beforeNavigate?: () => Promise<void> | void
) {
  const { navigateTo } = useItinerary()

  async function openItinerary() {
    if (!address) return
    await beforeNavigate?.()
    navigateTo(address)
  }

  return { openItinerary, canOpenItinerary: !!address }
}
