import { useKeyboardAdjust } from 'ui/components/keyboard/useKeyboardAdjust'

/*
 * On Android, webview crashes when opening/closing keyboard with `adjustMode=resize` : (https://passculture.atlassian.net/browse/PC-7593)
 * When does it happen in the user path ? When using the signup-confirmation deeplink right after seeing the  SignupConfirmationEmailSent screen.
 * The fix below will disable keyboard animation (only on Android) and inject css over the webview's JavaScript API to move up on the screen all the buttons which would normally be hidden by the keyboard.
 */
export function useKeyboardAdjustFixIdCheck() {
  useKeyboardAdjust()

  return `(function() {
function addCss(rule) {
  let css = document.createElement('style');
  css.type = 'text/css';
  if (css.styleSheet) {
    css.styleSheet.cssText = rule; // Support for IE
  }
  else {
    css.appendChild(document.createTextNode(rule)); // Support for the rest
  }
  document.getElementsByTagName('head')[0].appendChild(css);
}

// CSS rules
let rules = [
  '.form.form { justify-content: initial !important; }',
  '.form.form > button.primary { margin-top: 2em !important; }',
];

// Load the rules and execute after the DOM loads
window.onload = function() { 
  addCss(rules.join('\\n'));
};
})();`
}
