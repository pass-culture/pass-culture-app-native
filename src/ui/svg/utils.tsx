import { v1 as uuidv1 } from 'uuid'

export const svgIdentifier = (prefix?: string, suffix?: string) => {
  const uuid = uuidv1()
  const p = prefix || 'gradient'
  const s = suffix || ''
  const id = `${p}${uuid}${s}`
  const xlinkHref = `#${id}`
  const fill = `url(${xlinkHref})`
  return {
    id,
    xlinkHref,
    fill,
  }
}
