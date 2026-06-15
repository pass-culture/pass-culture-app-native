import { CategoryIdEnum, OfferExtraDataResponse } from 'api/gen'
import { OfferMetadataItemProps } from 'features/offer/components/OfferMetadataItem/OfferMetadataItem'

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: '2-digit',
  year: 'numeric',
}

function getValue(value?: string | null): string {
  return value ?? ''
}

function formatDate(dateString: string) {
  return dateString === ''
    ? ''
    : new Intl.DateTimeFormat('fr-FR', DATE_FORMAT_OPTIONS).format(new Date(dateString))
}

function filterEmptyItems(item: OfferMetadataItemProps): boolean {
  return item.value !== ''
}

export function getOfferMetadata(
  extraData?: OfferExtraDataResponse,
  categoryId?: CategoryIdEnum,
  hasArtists?: boolean
): OfferMetadataItemProps[] {
  const castValue = extraData?.cast?.join(', ')
  // For cinema offers, the cast is already displayed through the artist section
  // component, so the textual "Distribution" metadata would be a duplicate.
  // It is only hidden when artists are actually rendered (hasArtists), otherwise
  // the distribution information would disappear entirely from the page.
  const isDistributionDuplicated = categoryId === CategoryIdEnum.CINEMA && !!hasArtists

  return [
    {
      label: '',
      value: getValue(extraData?.certificate),
    },
    {
      label: 'Date de sortie',
      value: formatDate(getValue(extraData?.releaseDate)),
    },
    { label: 'Intervenant', value: getValue(extraData?.speaker) },
    { label: 'Éditeur', value: getValue(extraData?.editeur) },
    { label: 'Distribution', value: isDistributionDuplicated ? '' : getValue(castValue) },
  ].filter(filterEmptyItems)
}
