import{j as r}from"./jsx-runtime-BiHFnIch.js";import{d as c}from"./grid-C-3QDytX.js";import{t as V}from"./index-BXMVnZ8T.js";import{V as m}from"./VerticalDots-CTzTegO9.js";import"./index-CsVCrh6D.js";import"./_commonjsHelpers-DR3NjCyK.js";import"./index-C2Dso1zb.js";import"./lib-BWPdn4WI.js";import"./constants-C79QT0UB.js";import"./colors-oXVEEODc.js";const F={title:"features/profile/VerticalDots",component:m},s=e=>r.jsx(c.View,{style:{width:e.parentWidth,height:e.parentHeight},children:r.jsx(m,{...e})}),b=e=>r.jsxs(c.View,{children:[r.jsx(s,{...e}),r.jsx(s,{...e})]}),v=e=>r.jsx(c.View,{style:H.automaticWrapper,children:r.jsx(m.Auto,{...e})}),t={render:e=>r.jsx(s,{...e}),args:{dotSize:8,minimumDotSpacing:4,parentWidth:30,parentHeight:200,endsWithDot:!0},parameters:{docs:{description:{story:"This is a simple example where all dots are rounded."}}}},o={render:e=>r.jsx(s,{...e}),args:{...t.args,dotColor:V.colors.secondary},parameters:{docs:{description:{story:"You can change dot color."}}}},a={render:e=>r.jsx(s,{...e}),args:{...t.args,dotSize:{height:8,width:6}},parameters:{docs:{description:{story:"If you want a special shape you can give an object to `dotSize` instead of a number."}}}},n={render:e=>r.jsx(s,{...e}),args:{...t.args,dotSize:{height:8,width:6},firstDotSize:{height:7,width:6},lastDotSize:{height:7,width:6}},parameters:{docs:{description:{story:"An example where you can give custom sizes to the first and last dots."}}}},i={render:e=>r.jsx(b,{...e}),args:{...t.args,endsWithDot:!1},parameters:{docs:{description:{story:"An example where there is two `<VerticalDots />` following, so it shows how it is correctly spaced."}}}},d={render:e=>r.jsx(v,{...e}),args:{dotSize:4,endsWithDot:!0}},H=c.StyleSheet.create({automaticWrapper:{backgroundColor:V.colors.greyLight,alignItems:"center",width:30,height:100}});var p,h,l;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: args => <TemplateRenderer {...args} />,
  args: {
    dotSize: 8,
    minimumDotSpacing: 4,
    parentWidth: 30,
    parentHeight: 200,
    endsWithDot: true
  },
  parameters: {
    docs: {
      description: {
        story: 'This is a simple example where all dots are rounded.'
      }
    }
  }
}`,...(l=(h=t.parameters)==null?void 0:h.docs)==null?void 0:l.source}}};var g,u,w;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: args => <TemplateRenderer {...args} />,
  args: {
    ...Default.args,
    dotColor: theme.colors.secondary
  },
  parameters: {
    docs: {
      description: {
        story: 'You can change dot color.'
      }
    }
  }
}`,...(w=(u=o.parameters)==null?void 0:u.docs)==null?void 0:w.source}}};var D,S,f;a.parameters={...a.parameters,docs:{...(D=a.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: args => <TemplateRenderer {...args} />,
  args: {
    ...Default.args,
    dotSize: {
      height: 8,
      width: 6
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'If you want a special shape you can give an object to \`dotSize\` instead of a number.'
      }
    }
  }
}`,...(f=(S=a.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};var y,x,z;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: args => <TemplateRenderer {...args} />,
  args: {
    ...Default.args,
    dotSize: {
      height: 8,
      width: 6
    },
    firstDotSize: {
      height: 7,
      width: 6
    },
    lastDotSize: {
      height: 7,
      width: 6
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'An example where you can give custom sizes to the first and last dots.'
      }
    }
  }
}`,...(z=(x=n.parameters)==null?void 0:x.docs)==null?void 0:z.source}}};var j,W,R;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: args => <MultipleRenderer {...args} />,
  args: {
    ...Default.args,
    endsWithDot: false
  },
  parameters: {
    docs: {
      description: {
        story: 'An example where there is two \`<VerticalDots />\` following, so it shows how it is correctly spaced.'
      }
    }
  }
}`,...(R=(W=i.parameters)==null?void 0:W.docs)==null?void 0:R.source}}};var A,C,T;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: args => <AutomaticRenderer {...args} />,
  args: {
    dotSize: 4,
    endsWithDot: true
  }
}`,...(T=(C=d.parameters)==null?void 0:C.docs)==null?void 0:T.source}}};const G=["Default","WithCustomColor","WithObjectDotSize","WithCustomDotSize","WithTwo","AutomaticDots"];export{d as AutomaticDots,t as Default,o as WithCustomColor,n as WithCustomDotSize,a as WithObjectDotSize,i as WithTwo,G as __namedExportsOrder,F as default};
