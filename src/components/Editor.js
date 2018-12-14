import React from "react";
import styled from "styled-components";
import { variants } from "./Text";

const Container = styled.div`
  background: rgba(35, 43, 51, 1);
  /* border-top-left-radius: 5px; */
  /* border-bottom-left-radius: 5px; */
  width: 100%;
  height: 100%;
  display: flex;
  /* justify-content: center; */
  flex-direction: column;
`;

const TextEditor = styled.textarea.attrs(props => ({
  style: { ...variants.body, ...props.style }
}))`
  height: 100%;
  width: 100%;
  ::-webkit-scrollbar {
    display: none;
  }
  background: transparent;
  outline: none;
  border: none;
  resize: none;
  padding: 24px 32px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.82) !important;
  font-family: "IBM Plex Mono", monospace;
  font-weight: 500 !important;
`;

const Header = styled.div.attrs(props => ({
  style: variants.body
}))`
  min-height: 52px;
  height: 52px;
  width: 100%;
  -webkit-app-region: drag;
  border-bottom: 1px solid rgba(40, 48, 56, 1);
  background: rgba(35, 43, 51, 1);
  color: rgba(255, 255, 255, 0.82) !important;
  display: flex;
  align-items: center;
  padding: 0px 31px;
  font-weight: 500 !important;
  /* justify-content: center; */
  user-select: none;
`;

export const Editor = ({ date, ...props }) => {
  return (
    <Container>
      <Header>{date}</Header>
      <TextEditor {...props} />
    </Container>
  );
};
