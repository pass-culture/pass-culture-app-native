import{r}from"./index-CsVCrh6D.js";import{u as i}from"./useNavigation-AduvEkyI.js";function l(u){const o=i();arguments[1]!==void 0&&console.error(`You passed a second argument to 'useFocusEffect', but it only accepts one argument. If you want to pass a dependency array, you can use 'React.useCallback':

useFocusEffect(
  React.useCallback(() => {
    // Your code here
  }, [depA, depB])
);

See usage guide: https://reactnavigation.org/docs/use-focus-effect`),r.useEffect(()=>{let s=!1,e;const n=()=>{const t=u();if(t===void 0||typeof t=="function")return t};o.isFocused()&&(e=n(),s=!0);const a=o.addListener("focus",()=>{s||(e!==void 0&&e(),e=n(),s=!0)}),c=o.addListener("blur",()=>{e!==void 0&&e(),e=void 0,s=!1});return()=>{e!==void 0&&e(),a(),c()}},[u,o])}export{l as u};
