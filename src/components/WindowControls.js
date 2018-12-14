import React from "react";
import styled from "styled-components";

const WindowControlContainer = styled.div`
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-app-region: drag;
`;

const WindowButton = styled.div`
  min-width: 12px;
  min-height: 12px;
  -webkit-app-region: no-drag;

  max-width: 12px;
  max-height: 12px;

  width: 12px;
  height: 12px;

  border-radius: 100%;
  margin: 0px 4px;
  background-color: ${props => props.color};
`;

export const WindowControls = () => (
  <WindowControlContainer>
    <WindowButton color="rgba(252, 99, 94, 1)" />
    <WindowButton color="rgba(253, 188, 64, 1)" />
    <WindowButton color="rgba(54, 207, 76, 1)" />
  </WindowControlContainer>
);
