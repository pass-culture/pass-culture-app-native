import{j as e}from"./jsx-runtime-BiHFnIch.js";import{a as w}from"./index-DUNsG_HI.js";import{r as V}from"./index-CsVCrh6D.js";import{d as a,T as l}from"./grid-C-3QDytX.js";import{I as j,l as I}from"./IntersectionObserver-C7BNrXeG.js";import{t as h}from"./index-BXMVnZ8T.js";import"./v4-Dv1xt2bl.js";import"./_commonjsHelpers-DR3NjCyK.js";import"./index-C2Dso1zb.js";import"./throttle-DZN4Rna1.js";import"./isObjectLike-e0j5qXck.js";import"./toNumber-DpaENzzl.js";import"./isSymbol-CsCJre4W.js";import"./lib-BWPdn4WI.js";import"./constants-C79QT0UB.js";import"./colors-oXVEEODc.js";const F={title:"features/shared/IntersectionObserver",component:j,parameters:{axe:{disabledRules:["scrollable-region-focusable"]}}},i=r=>{const[O,f]=V.useState(!1),y=c=>{f(c),w("visibility change")(c)};return e.jsxs(I.IOScrollView,{style:n.scrollView,children:[e.jsx(a.View,{style:n.stateObserverView,children:e.jsxs(l.BodyAccentXs,{children:[O?"Observer visible":"Observer not visible"," - scroll to test"]})}),e.jsx(j,{onChange:y,threshold:r.threshold,children:e.jsx(a.View,{style:n.observerView,children:e.jsx(l.BodyAccentXs,{children:"The observer"})})})]})},s={render:r=>e.jsx(i,{...r}),args:{threshold:0}},t={render:r=>e.jsx(i,{...r}),args:{threshold:"50%"}},o={render:r=>e.jsx(i,{...r}),args:{threshold:20}},n=a.StyleSheet.create({scrollView:{height:200},stateObserverView:{height:220,justifyContent:"center",backgroundColor:h.colors.greyLight},observerView:{height:100,backgroundColor:h.colors.attention}});var p,d,m;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: props => <IntersectionObserverTemplate {...props} />,
  args: {
    threshold: 0
  }
}`,...(m=(d=s.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var b,u,g;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: props => <IntersectionObserverTemplate {...props} />,
  args: {
    threshold: '50%'
  }
}`,...(g=(u=t.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var v,x,T;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: props => <IntersectionObserverTemplate {...props} />,
  args: {
    threshold: 20
  }
}`,...(T=(x=o.parameters)==null?void 0:x.docs)==null?void 0:T.source}}};const G=["WithoutThreshold","WithPercentThreshold","WithNumberThreshold"];export{o as WithNumberThreshold,t as WithPercentThreshold,s as WithoutThreshold,G as __namedExportsOrder,F as default};
