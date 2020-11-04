import { getSpacing } from './spacing'

/* This function is used to mimick the shorthand padding property of browsers :
1. All four sides
--> WEB : padding: 5 | MOBILE : ...padding(5)
2. vertical | horizontal
--> WEB : padding: 5 10 | MOBILE : ...padding(5, 10)
3. top | horizontal | bottom
--> WEB : padding: 5 10 15 | MOBILE : ...padding(5, 10, 15)
4. top | right | bottom | left
--> WEB : padding: 5 10 15 20 | MOBILE : ...padding(5, 10, 15, 20)
*/
export function padding(top: number, right?: number, bottom?: number, left?: number) {
  const padding = {
    paddingTop: top,
    paddingRight: top,
    paddingBottom: top,
    paddingLeft: top,
  }
  if (right) {
    padding.paddingRight = right
    padding.paddingLeft = right
  }
  if (bottom) {
    padding.paddingBottom = bottom
  }
  if (left) {
    padding.paddingLeft = left
  }
  return {
    paddingTop: getSpacing(padding.paddingTop),
    paddingRight: getSpacing(padding.paddingRight),
    paddingBottom: getSpacing(padding.paddingBottom),
    paddingLeft: getSpacing(padding.paddingLeft),
  }
}
