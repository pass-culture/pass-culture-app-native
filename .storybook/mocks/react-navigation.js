export const useNavigation = () => {
    return {
      push: () => null,
      goBack: () => null,
      pop: () => null,
      popToTop: () => null,
      reset: () => null,
      replace: () => null,
      navigate: () => null,
      setParams: () => null,
      jumpTo: () => null
    };
  };

export const useLinkProps = () => {
  return {
    href: 'href',
    accessibilityRole: "link",
    onPress: () => {}
}
}

export const useFocusEffect = () => null