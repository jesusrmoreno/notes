import React from "react";
import styled from "styled-components";
import { variants } from "./Text";

const Base = styled.button`
  border-radius: 2px;
  outline: none;
  border: 1px solid transparent;
  padding: 4px 8px;
  height: 100%;
  user-select: none;
  font-weight: 500;
  min-width: 64px;
`;

const Button = props => {
  return (
    <Base
      {...props}
      style={{
        ...variants.button,
        ...props.style
      }}
    />
  );
};

export const Primary = styled(Button)`
  background: rgba(14, 118, 186, 1);
  color: white !important;
  transition: all 150ms;
  border: 1px solid #979797;
  &:hover {
    color: #0e76ba;
    border: 1px solid #0e76ba;
    background-color: rgba(14, 118, 186, 0.1);
  }
  &:active {
    color: white;
    background-color: rgba(14, 118, 186, 1);
  }
`;

export const Negative = styled(Button)`
  background: white;
  color: #bf231f;
  transition: all 150ms;
  border: 1px solid #bf231f;
  &:hover,
  &:focus {
    background-color: rgba(191, 35, 31, 0.1);
  }
  &:active {
    color: white;
    background-color: rgba(191, 35, 31, 1);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  padding: 4px 0px;
  width: 100%;
  justify-content: ${props => (props.alignRight ? "flex-end" : "flex-start")};
`;
