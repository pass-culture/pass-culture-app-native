export const decodeHTMLValue = (value: string) =>
  value
    .replaceAll('&lt;em&gt;', '<mark>')
    .replaceAll('&lt;/em&gt;', '</mark>')
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&')
