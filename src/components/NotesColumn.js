import React from "react";
import styled from "styled-components";
import { SectionTitle } from "./SectionTitle";
import { Text, variants } from "./Text";
import moment from "moment";

const Header = styled.div`
  height: 100px;
  background-color: rgba(247, 247, 247, 1);
  border-bottom: 1px solid rgba(218, 218, 218, 1);
  display: flex;
`;

const HeaderTab = styled.div.attrs(props => ({
  style: variants.caption
}))`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const NotebarContainer = styled.div`
  /* background-color: rgba(252, 252, 252, 1); */
  background-color: rgba(247, 247, 247, 1);
  width: 350px;
  min-width: 350px;
  height: 100%;
  overflow-y: scroll;
  cursor: default;
  user-select: none;
  border-right: 1px solid rgba(218, 218, 218, 1);
  padding: 8px 0px;
`;

const Note = styled.div`
  padding: 4px 8px;
  display: flex;
  background: ${props => (props.selected ? "rgba(245, 245, 245, 1)" : null)};
  flex-direction: column;
`;

export const NotesColumn = ({
  notes,
  activeNoteId,
  onNoteClick,
  contentById,
  metaById
}) => (
  <div>
    <Header>
      <HeaderTab>Notes</HeaderTab>
      <HeaderTab>Tasks</HeaderTab>
    </Header>
    <NotebarContainer>
      <SectionTitle label="Notes" />
      {notes.map(id => {
        return (
          <Note
            key={id}
            selected={activeNoteId === id}
            onClick={() => onNoteClick(id)}
          >
            <Text ui>
              {contentById[id]
                .split("\n")[0]
                .replace("+ ", "")
                .replace("- ", "").length
                ? contentById[id]
                    .split("\n")[0]
                    .replace("+ ", "")
                    .replace("- ", "")
                : "New Note"}
            </Text>
            <div style={{ height: 4 }} />
            <Text type="caption">
              Edited: {moment(metaById[id].updatedAt).fromNow()}
            </Text>
          </Note>
        );
      })}
    </NotebarContainer>
  </div>
);
