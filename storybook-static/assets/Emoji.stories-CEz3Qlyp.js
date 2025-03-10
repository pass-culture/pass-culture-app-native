import{j as t}from"./jsx-runtime-BiHFnIch.js";import{r as c,R as d}from"./index-CsVCrh6D.js";import{d as j,s as u,g as p}from"./grid-C-3QDytX.js";import{E as l}from"./Emoji-BiG4EnKA.js";import"./_commonjsHelpers-DR3NjCyK.js";import"./index-C2Dso1zb.js";const h={title:"Fondations"},n=()=>{const m=c.useMemo(()=>Object.entries(l).sort(([e],[r])=>e<r?-1:e>r?1:0),[]);return t.jsx(d.Fragment,{children:m.map(([e,r])=>{const a=r;return t.jsxs(x,{children:[t.jsx(a,{}),t.jsxs(j.Text,{children:[" - ",e]})]},e)})})},x=u.View({flexDirection:"row",alignItems:"center",paddingVertical:p(1)});var s,o,i;n.parameters={...n.parameters,docs:{...(s=n.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
  const sortedEmojis = useMemo(() => {
    return Object.entries(Emoji).sort(([name1], [name2]) => {
      if (name1 < name2) return -1;else if (name1 > name2) return 1;else return 0;
    });
  }, []);
  return <React.Fragment>
      {sortedEmojis.map(([name, emoji]) => {
      const Emoji = emoji;
      return <AlignedText key={name}>
            <Emoji />
            <Text> - {name}</Text>
          </AlignedText>;
    })}
    </React.Fragment>;
}`,...(i=(o=n.parameters)==null?void 0:o.docs)==null?void 0:i.source}}};const A=["Emojis"];export{n as Emojis,A as __namedExportsOrder,h as default};
