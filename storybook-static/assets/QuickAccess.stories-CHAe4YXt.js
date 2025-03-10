import{j as r}from"./jsx-runtime-BiHFnIch.js";import{s as d,u as l}from"./index-CsrLR6Ek.js";import{r as u}from"./index-CsVCrh6D.js";import{a as m,g as n,T as s}from"./grid-C-3QDytX.js";import{q as y}from"./styled-components.browser.esm-DFuWokAj.js";import{d as f}from"./displayOnFocus.web-D3_kmd2D.js";import"./_commonjsHelpers-DR3NjCyK.js";import"./index-DrFu-skq.js";import"./index-C2Dso1zb.js";import"./HiddenAccessibleText-DHdenKna.js";const o=({href:e,title:p})=>r.jsx(g,{href:e,children:p}),g=f(y.a(({theme:e})=>({...e.designSystem.typography.button,color:e.uniqueColors.brand,backgroundColor:e.colors.white,textDecoration:"none",display:"flex",alignItems:"center",alignSelf:"center","&:focus":{height:`${m(11)} !important`,margin:n(2),paddingLeft:n(4),paddingRight:n(4),outlineOffset:0,borderWidth:1,borderStyle:"solid",borderColor:e.uniqueColors.brand,borderRadius:e.borderRadius.button*2}})));try{o.displayName="QuickAccess",o.__docgenInfo={description:"",displayName:"QuickAccess",props:{href:{defaultValue:null,description:"",name:"href",required:!0,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!0,type:{name:"string"}}}}}catch{}const E={title:"ui/accessibility/QuickAccess",component:o},b="QuickAccess",h=" is a component that should be visible only when giving focus",k=e=>r.jsxs(u.Fragment,{children:[r.jsxs(s.Body,{children:[r.jsx(s.BodyAccentXs,{children:b}),h]}),r.jsx(o,{...e})]}),t={render:e=>r.jsx(k,{...e}),args:{href:"#",title:"Go to link"},name:"QuickAccess",play:async()=>{await d.findByRole("link"),l.tab()}};var i,a,c;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: (props: React.ComponentProps<typeof QuickAccess>) => <StoryComponent {...props} />,
  args: {
    href: '#',
    title: 'Go to link'
  },
  name: 'QuickAccess',
  play: async () => {
    await screen.findByRole('link'); // wait first render

    userEvent.tab();
  }
}`,...(c=(a=t.parameters)==null?void 0:a.docs)==null?void 0:c.source}}};const v=["Default"];export{t as Default,v as __namedExportsOrder,E as default};
