//TODO(PC-35271) - make this function generic so that several tagFilters can be added
export const buildTagFilters = ({
  shouldExcludeFutureOffers = true,
}: {
  shouldExcludeFutureOffers?: boolean
}) => {
  return shouldExcludeFutureOffers && { tagFilters: '["-is_future"]' }
}
