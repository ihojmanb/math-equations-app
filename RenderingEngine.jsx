import { useMemo } from "react";
import {
  HTMLElementModel,
  HTMLContentModel,
  TRenderEngineProvider,
  RenderHTMLConfigProvider,
  domNodeToHTMLString,
  RenderHTMLSource,
} from "react-native-render-html";
import { View, StyleSheet } from "react-native";
import { MathJaxSvg } from "react-native-mathjax-html-to-svg";

const BLOCK_PATTERN = /(?:\${1}|\\\[|\\(begin|end)\{.*?})/g;

const customHTMLElementModels = {
  math: HTMLElementModel.fromCustomModel({
    tagName: "math",
    contentModel: HTMLContentModel.mixed,
  }),
};

const MathJaxRenderer = (props) => {
  const { TDefaultRenderer } = props;
  const {
    tnode: { domNode },
  } = props;
  const html = useMemo(() => domNodeToHTMLString(domNode), [domNode]);
  const isBlock = html.match(BLOCK_PATTERN);
  return (
    <View
      style={{
        verticalAlign: "middle",
        position: "relative",
        margin: "auto",
      }}
    >
      <MathJaxSvg
        fontSize={18}
        color={"black"}
        fontCache
        style={StyleSheet.flatten([
          {
            alignItems: "center",
            verticalAlign: "bottom",
          },
          isBlock
            ? {
                marginVertical: 10,
              }
            : {
                justifyContent: "center",
                backgroundColor: "transparent",
              },
        ])}
      >
        {html}
      </MathJaxSvg>
    </View>
  );
};

const renderers = {
  math: MathJaxRenderer,
};

const mathTagLatexWrapper = (str) => {
  const bracketPattern = /\\\[.*?\\\]/gs;
  const latexPattern =
    /\\\[.*?\\\]|\\\(.*?\\\)|\$\$(.*?)\$\$|(?:\\\(|\\(begin|end)\{.*?})[^<]*(?:\\\)|\\(begin|end)\{.*?})/gs;
  let match = str.match(latexPattern);
  if (match) {
    let newStr = str.replace(latexPattern, (match) => {
      if (match.match(bracketPattern)) {
        return `<div style="margin: auto; margin-bottom: 20px;"><math>${match}</math></div>`;
      }
      return `<math>${match}</math>`;
    });
    return newStr;
  } else {
    return str;
  }
};

const RenderingEngine = ({ html, width, margin = 0 }) => {
  let wrappedHtml = html;
  wrappedHtml = mathTagLatexWrapper(html);

  return (
    <TRenderEngineProvider
      customHTMLElementModels={customHTMLElementModels}
      baseStyle={{
        fontSize: "1.2rem",
        textAlign: "justify",
        marginRight: margin,
        marginLeft: margin,
      }}
    >
      <RenderHTMLConfigProvider renderers={renderers}>
        <RenderHTMLSource source={{ html: wrappedHtml }} contentWidth={width} />
      </RenderHTMLConfigProvider>
    </TRenderEngineProvider>
  );
};

export default RenderingEngine;
