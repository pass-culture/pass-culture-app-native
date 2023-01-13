import 'styled-components/native'

declare module 'styled-components-react-native/node_modules/@types/react-native' {
  /**
   * react-native with react-native-web extensions for accessibility (due to update to version 0.18 of react-native-web)
   * @see https://necolas.github.io/react-native-web/docs/accessibility/#aria--props-api
   */
  export interface AccessibilityProps {
    /**
     * Equivalent to [aria-atomic](https://www.w3.org/TR/wai-aria-1.2/#aria-atomic).
     */
    accessibilityAtomic?: boolean
    /**
     * Equivalent to [aria-checked](https://www.w3.org/TR/wai-aria-1.2/#aria-checked).
     */
    accessibilityChecked?: boolean
    /**
     * Equivalent to [aria-controls](https://www.w3.org/TR/wai-aria-1.2/#aria-controls).
     */
    accessibilityControls?: string
    /**
     * Equivalent to [aria-current](https://www.w3.org/TR/wai-aria-1.2/#aria-current).
     */
    accessibilityCurrent?: string
    /**
     * Equivalent to [aria-describedby](https://www.w3.org/TR/wai-aria-1.2/#aria-describedby).
     */
    accessibilityDescribedBy?: string
    /**
     * Equivalent to [aria-expanded](https://www.w3.org/TR/wai-aria-1.2/#aria-expanded).
     */
    accessibilityExpanded?: boolean
    /**
     * Equivalent to [aria-hidden](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden).
     */
    accessibilityHidden?: boolean
    /**
     * Equivalent to [aria-labelledby](https://www.w3.org/TR/wai-aria-1.2/#aria-labelledby).
     */
    accessibilityLabelledBy?: string
    /**
     * Equivalent to [aria-live](https://www.w3.org/TR/wai-aria-1.2/#aria-live).
     */
    accessibilityLiveRegion?: 'assertive' | 'polite' | 'off'
    /**
     * Equivalent to [aria-modal](https://www.w3.org/TR/wai-aria-1.2/#aria-modal).
     */
    accessibilityModal?: boolean
    /**
     * Equivalent to [aria-required](https://www.w3.org/TR/wai-aria-1.2/#aria-required).
     */
    accessibilityRequired?: boolean
  }
}
