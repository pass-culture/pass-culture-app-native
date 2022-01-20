import { getSpacing } from './spacing'

export const TAB_BAR_COMP_HEIGHT = getSpacing(16)
export const BOTTOM_CONTENT_PAGE_OFFSET_TOP_HEIGHT_DESKTOP_TABLET = getSpacing(10)
export const SECTION_ROW_ICON_SIZE = getSpacing(6)
export const PAGE_HEADER_HEIGHT = getSpacing(16)

// general icon size
export const STANDARD_ICON_SIZE = getSpacing(8) // 32

// icons used for Secondary buttons or bigger should be imported with SM_ICON_SIZE
export const SM_ICON_SIZE = getSpacing(6) // 24

// icons used for tertiary buttons or smaller should be imported with SM_ICON_SIZE
export const XS_SMALLER_ICON_SIZE = getSpacing(5) // 20

// icons used for quaternary buttons or smaller should be imported with XXS_SMALLER_ICON_SIZE
export const XXS_SMALLER_ICON_SIZE = getSpacing(4) // 16
