import React from "react";

function round(value) {
  return Math.round(value * 1e5) / 1e5;
}

const fontWeightLight = 300;
const fontWeightRegular = 400;
const fontWeightMedium = 500;
const htmlFontSize = 16;
const fontSize = 14;
const coef = fontSize / 14;
const pxToRem = size => `${(size / htmlFontSize) * coef}rem`;
const buildVariant = (fontWeight, size, lineHeight, letterSpacing, casing) => ({
  fontWeight,
  fontSize: pxToRem(size),
  // Unitless following http://meyerweb.com/eric/thoughts/2006/02/08/unitless-line-heights/
  lineHeight,
  // The letter spacing was designed for the Roboto font-family. Using the same letter-spacing
  // across font-families can cause issues with the kerning.
  letterSpacing: `${round(letterSpacing / size)}em`,
  ...casing
});

const caseAllCaps = {
  textTransform: "uppercase"
};

export const variants = {
  h1: buildVariant(fontWeightLight, 96, 1, -1.5),
  h2: buildVariant(fontWeightLight, 60, 1, -0.5),
  h3: buildVariant(fontWeightRegular, 48, 1.04, 0),
  h4: buildVariant(fontWeightRegular, 34, 1.17, 0.25),
  h5: buildVariant(fontWeightRegular, 24, 1.33, 0),
  h6: buildVariant(fontWeightMedium, 20, 1.6, 0.15),
  subtitle1: buildVariant(fontWeightRegular, 16, 1.75, 0.15),
  subtitle2: buildVariant(fontWeightMedium, 14, 1.57, 0.1),
  body1: buildVariant(fontWeightRegular, 16, 1.5, 0.15),
  body: buildVariant(fontWeightRegular, 14, 1.5, 0.15),
  button: buildVariant(fontWeightMedium, 12, 1.5, 0.4, caseAllCaps),
  caption: buildVariant(fontWeightRegular, 11, 1.66, 0.4),
  overline: buildVariant(fontWeightRegular, 12, 2.66, 1, caseAllCaps)
};

const uiText = {
  userSelect: "none"
};

const EMPTY_OBJ = {};

export const Text = ({
  children,
  ui,
  type = "body",
  color,
  style,
  ...props
}) => {
  const u = ui ? uiText : EMPTY_OBJ;
  const s = variants[type];
  if (!s) {
    console.warn("Unsupported text type:", type);
  }
  return (
    <span style={{ ...variants[type], ...u, ...style, color }} {...props}>
      {children}
    </span>
  );
};

export const H1 = props => <Text {...props} type="h1" />;
export const H2 = props => <Text {...props} type="h2" />;
export const H3 = props => <Text {...props} type="h3" />;
export const H4 = props => <Text {...props} type="h4" />;
export const H5 = props => <Text {...props} type="h5" />;
export const H6 = props => <Text {...props} type="h6" />;
export const Subtitle1 = props => <Text {...props} type="subtitle1" />;
export const Subtitle2 = props => <Text {...props} type="subtitle2" />;
export const Body1 = props => <Text {...props} type="body1" />;
export const Body = props => <Text {...props} type="body" />;
export const Button = props => <Text {...props} type="button" />;
export const Caption = props => <Text {...props} type="caption" />;
export const Overline = props => <Text {...props} type="overline" />;
