import UIKit
import Foundation
import Lottie

@objc class Dynamic: NSObject {

  @objc func createAnimationView(rootView: UIView, lottieName: String) -> UIView {
    let animationView = LottieAnimationView(name: lottieName)
    animationView.frame = rootView.frame
    animationView.center = rootView.center
    animationView.backgroundColor = UIColor.white;
    return animationView;
  }

  @objc func play(animationView: UIView) {
    guard let lottieView = animationView as? LottieAnimationView else { return }
    lottieView.loopMode = LottieLoopMode.loop
    lottieView.play();
  }
}