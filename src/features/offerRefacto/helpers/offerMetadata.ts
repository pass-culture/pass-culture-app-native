import { OfferExtraDataResponse } from 'api/gen'
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

export function getMetadata(extraData?: OfferExtraDataResponse): OfferMetadataItemProps[] {
  const castValue = extraData?.cast?.join(', ')

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
    { label: 'Distribution', value: getValue(castValue) },
  ].filter(filterEmptyItems)
}
