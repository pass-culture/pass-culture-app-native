/* eslint-disable @typescript-eslint/no-empty-function */

import React, { Component, ComponentType } from 'react'
import { View as CoreView, Text as CoreText, Animated } from 'react-native'

export const createAnimatableComponent = (WrappedComponent: ComponentType<any>) => {
  const Animatable = Animated.createAnimatedComponent(WrappedComponent)

  return class AnimatableComponent extends Component {
    handleRef = (ref: any) => {
      this.ref = ref
    }
    transition() {}
    stopAnimation() {}
    stopAnimations() {}
    transitionTo() {} // <-- this fixes the error "TypeError: _this.backdropRef.transitionTo is not a function"
    animate() {
      // <-- this was required in my specific example
      return { then: () => {} }
    }
    // mock any other function you using

    render() {
      return <Animatable ref={this.handleRef} {...this.props} />
    }
  }
}
export const initializeRegistryWithDefinitions = () => {}
export const View = createAnimatableComponent(CoreView)
export const Image = createAnimatableComponent(CoreText)
