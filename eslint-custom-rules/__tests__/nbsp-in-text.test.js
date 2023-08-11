import { RuleTester } from 'eslint'
import { config } from './config'

import rule from '../nbsp-in-text'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    // \u00a0 for 'myText !' with characters !, ?, :, » and €
    { code: `'myText\\u00a0!'` },
    // \u00a0 for '« myText'
    { code: `'«\\u00a0myText'` },
    // \u00a0 for `myText !` with characters !, ?, :, » and €
    { code: `\`myText\\u00a0:\`` },
    // \u00a0 for `« myText`
    { code: `\`«\\u00a0myText\`` },
    // &nbsp; for "myText !" with characters !, ?, :, » and €
    { code: `"myText&nbsp;?"` },
    // &nbsp; for "« myText"
    { code: `"«&nbsp;myText"` },
    // &nbsp; for <Text>myText !</Text> with characters !, ?, :, » and €
    { code: '<Text>myText&nbsp;€</Text>' },
    // &nbsp; for <Text>« myText</Text>
    { code: '<Text>«&nbsp;myText</Text>' },
  ],
  invalid: [
    { code: `'myText !'`, output: `'myText\\u00a0!'`, errors: 1 },
    { code: `'« myText'`, output: `'«\\u00a0myText'`, errors: 1 },
    { code: `\`myText :\`` ,output: `\`myText\\u00a0:\``, errors: 1 },
    { code: `\`« myText\`` ,output: `\`«\\u00a0myText\``, errors: 1 },
    { code: `"myText ?"` ,output: `"myText&nbsp;?"`, errors: 1 },
    { code: `"« myText"` ,output: `"«&nbsp;myText"`, errors: 1 },
    { code: '<Text>myText €</Text>' ,output: '<Text>myText&nbsp;€</Text>', errors: 1 },
    { code: '<Text>« myText</Text>' ,output: '<Text>«&nbsp;myText</Text>', errors: 1 },

  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) => Object.assign(t, config))

ruleTester.run('nbsp-in-text', rule, tests)
