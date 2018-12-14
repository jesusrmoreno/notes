import React from "react";
import styled from "styled-components";
import { WindowControls } from "./WindowControls";

const Container = styled.div`
  height: 100%;
  background: rgba(31, 38, 45, 1);
  min-width: 80px;
  border-right: 1px solid rgba(40, 48, 56, 1);
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ViewButtonContainer = styled.div`
  height: 48px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  color: ${props =>
    props.selected ? "rgba(42, 163, 239, 1)" : "rgba(255, 255, 255, .75)"};
  transition: all 100ms;

  &:hover {
    color: ${props => (!props.selected ? "white" : null)};
  }
`;

const ViewButton = ({ icon, action, selected }) => {
  return (
    <ViewButtonContainer onClick={action} selected={selected}>
      <span className={`fa fa-fw ${icon}`} />
    </ViewButtonContainer>
  );
};

const ActionButtonContainer = styled(ViewButtonContainer)`
  width: 64px;
  border-radius: 4px;
  background-color: rgba(42, 163, 239, 1);
  color: white;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.4);

  &:active {
    background-color: rgba(42, 163, 239, 0.1);
  }
`;

const ActionButton = ({ icon, action, selected }) => {
  return (
    <ActionButtonContainer onClick={action} selected={selected}>
      <span className={`fa fa-fw ${icon}`} />
    </ActionButtonContainer>
  );
};

const NewNoteButton = ({ action }) => {
  return <ActionButton icon="fa-feather" action={action} />;
};

export const Sidebar = ({ createNewNote }) => {
  return (
    <Container>
      <WindowControls />
      <div style={{ height: 16 }} />
      <NewNoteButton action={createNewNote} />
      <ViewButton icon="fa-sticky-note" />
      <ViewButton icon="fa-list-ol" />
    </Container>
  );
};
