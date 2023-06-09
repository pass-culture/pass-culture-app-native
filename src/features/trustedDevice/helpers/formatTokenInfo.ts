import { TokenInfo } from 'features/trustedDevice/helpers/getTokenInfo'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { formatToHour } from 'libs/parsers'

const UNKNOWN_VALUE_TEXT = 'Indéterminé'

export const formatTokenInfo = (tokenInfo?: TokenInfo) => {
  const { location, os, source, dateCreated } = tokenInfo ?? {}

  return {
    location: location || UNKNOWN_VALUE_TEXT,
    loginDate: formatLoginDate(dateCreated),
    osAndSource: formatOsAndSource(os, source),
  }
}

// Exported for tests
export const formatOsAndSource = (os?: string, source?: string) => {
  let osAndSource = os || UNKNOWN_VALUE_TEXT

  if (os && source) {
    osAndSource = `${os} - ${source}`
  } else if (source) {
    osAndSource = source
  }

  return osAndSource
}

// Exported for tests
export const formatLoginDate = (dateCreated?: string) => {
  let formattedDatetime = UNKNOWN_VALUE_TEXT

  if (dateCreated && !isNaN(Date.parse(dateCreated))) {
    const loginDate = new Date(dateCreated)

    const formattedDate = formatToSlashedFrenchDate(loginDate)
    const formattedTime = formatToHour(loginDate)
    formattedDatetime = `Le ${formattedDate} à ${formattedTime}`
  }

  return formattedDatetime
}
