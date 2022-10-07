import { getSpacing } from './spacing'

export const LINE_BREAK = '\n'
export const DOUBLE_LINE_BREAK = '\n\n'
export const SPACE = ' '

export const TAB_BAR_COMP_HEIGHT = getSpacing(16)
export const BOTTOM_CONTENT_PAGE_OFFSET_TOP_HEIGHT_DESKTOP_TABLET = getSpacing(10)
export const SECTION_ROW_ICON_SIZE = getSpacing(6)

export const MARGIN_HORIZONTAL = getSpacing(6)
export const DESKTOP_CONTENT_MEDIUM_WIDTH = getSpacing(80)
export const DESKTOP_CONTENT_MAX_WIDTH = getSpacing(125)

// buttons
export const TALL_BUTTON_HEIGHT = getSpacing(12)
export const SMALL_BUTTON_HEIGHT = getSpacing(10)
export const EXTRA_SMALL_BUTTON_HEIGHT = getSpacing(8)
export const DEFAULT_INLINE_BUTTON_HEIGHT = getSpacing(4)

// icons used for Secondary buttons or bigger should be imported with STANDARD_ICON_SIZE
export const STANDARD_ICON_SIZE = getSpacing(8)
// icons used for secondary buttons or bigger should be imported with SMALL_ICON_SIZE
export const SMALL_ICON_SIZE = getSpacing(6)
// icons used for tertiary buttons or smaller should be imported with SMALLER_ICON_SIZE
export const SMALLER_ICON_SIZE = getSpacing(5)
// icons used for quaternary buttons or smaller should be imported with XXS_SMALLER_ICON_SIZE
export const EXTRA_SMALL_ICON_SIZE = getSpacing(4)
// icons used for illustrations should be imported with ILLUSTRATION_ICON_SIZE
export const ILLUSTRATION_ICON_SIZE = getSpacing(35) // 140
// icons used for full page illustrations should be imported with FULLPAGE_ILLUSTRATION_ICON_SIZE
export const FULLPAGE_ILLUSTRATION_ICON_SIZE = getSpacing(50)
