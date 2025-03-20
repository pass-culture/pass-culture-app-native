export const buildTagFilters = ({
  shouldExcludeFutureOffers = true,
}: {
  shouldExcludeFutureOffers?: boolean
}) => {
  return shouldExcludeFutureOffers && { tagFilters: '["-is_future"]' }
}
