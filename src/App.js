import React, { useCallback } from "react";
import styled, { ThemeProvider } from "styled-components";
import { Text, variants } from "./components/Text";
import { useStoredState } from "./util/useStoredState";
import uuid from "uuid/v4";
import moment from "moment";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
const theme = {
  textDefault: "rgba(0, 0, 0, .87)",
  textLight: "rgba(0, 0, 0, .52)"
};

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  opacity: ${props => (props.loading ? 0 : 1)};
  transition: opacity 50ms;
  background: rgba(18, 18, 18, 1);
  filter: invert(0);
`;

const Box = styled.div`
  display: flex;
  width: ${props => props.width};
  height: ${props => props.height};
  flex-direction: ${props => props.flexDirection || "row"};
  /* flex-shrink: 0; */
`;

const UIRow = styled.div`
  padding: 0px 8px;
  height: 24px;
  align-items: center;
  display: flex;
  color: ${props => props.theme.textLight};
`;

const SectionTitleContainer = styled.div`
  padding: 0px 8px 8px;
  /* height: 24px; */
  align-items: center;
  display: flex;
  color: ${props => props.theme.textLight};
  .action-button {
    opacity: 1;
    transition: all 100ms;
    background: rgba(43, 138, 245, 1);
  }
`;

const SectionTitle = ({ label, actionLabel, action, ...props }) => {
  return (
    <SectionTitleContainer {...props}>
      <Text
        ui
        type="caption"
        style={{ textTransform: "uppercase", fontWeight: 500 }}
      >
        {label}
      </Text>
      <div style={{ flex: 1 }} />
      {actionLabel && (
        <Text
          ui
          className="action-button"
          type="caption"
          style={{
            textTransform: "uppercase",
            fontWeight: 500,
            color: "blue",
            padding: "1px 4px",

            borderRadius: 3
          }}
          color="white"
          onClick={action}
        >
          {actionLabel}
        </Text>
      )}
    </SectionTitleContainer>
  );
};

const SidebarContainer = styled.div`
  width: 500px;
  height: 100vh;
  background-color: rgba(255, 255, 255, 1);
  overflow-y: scroll;
  cursor: default;
  user-select: none;
  padding: 8px 0px;
`;

const loaded = (...args) => !args.filter(v => v).length;

const Editor = styled.textarea.attrs(props => ({
  style: { ...variants.body, ...props.style }
}))`
  background: white;
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  resize: none;
  padding: 8px 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87) !important;
  font-family: monaco;
  /* font-size: 14px; */
`;

const TodoContainer = styled.div`
  padding: 8px 8px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const getItems = (noteState, useActiveId, c) => {
  const items = [];
  noteState.notes.forEach(noteId => {
    const value = noteState.contentById[noteId];
    const lines = value
      .split("\n")
      .map((content, index) => ({ content, index }));

    lines
      .filter(line => {
        const char = line.content.split("")[0];
        return char === c;
      })
      .forEach(({ content, index }) => {
        const assignmentOpener = content.indexOf("(");
        const assignmentCloser = content.indexOf(")");
        const tag = content.substring(assignmentOpener, assignmentCloser + 1);
        const contentWithoutAssignee = content.replace(tag, "");
        const assignee = tag.substring(1, tag.length - 1);

        const tagOpener = content.indexOf("[");
        const tagCloser = content.indexOf("]");

        const tagString = content.substring(tagOpener, tagCloser + 1);
        const tagListString = tagString.substring(1, tagString.length - 1);
        const contentWithoutTags = contentWithoutAssignee.replace(
          tagString,
          ""
        );
        const tags = tagListString.split(", ").filter(t => t !== "");
        items.push({
          display: contentWithoutTags.replace(`${c} `, ""),
          original: content,
          assignee: assignee !== "" ? assignee : null,
          tags,
          index,
          noteId
        });
      });
  });
  return orderBy(items, i => i.assignee);
};
const getCompleted = (noteState, useActiveId) =>
  getItems(noteState, useActiveId, "-");
const getTodos = (noteState, useActiveId) =>
  getItems(noteState, useActiveId, "+");

const useNoteUpdate = (noteState, setNoteState) => {
  return useCallback(
    (value, id) => {
      const noteId = id || uuid();
      const currentNotes = id ? noteState.notes : [noteId, ...noteState.notes];
      const updatedAt = Date.now();

      const createdAt = get(
        noteState,
        ["metaById", noteId, "createdAt"],
        updatedAt
      );

      setNoteState({
        notes: currentNotes,
        activeNoteId: noteState.activeNoteId || noteId,
        contentById: {
          ...noteState.contentById,
          [noteId]: value
        },
        metaById: {
          ...noteState.metaById,
          [noteId]: {
            updatedAt,
            createdAt
          }
        }
      });
    },
    [noteState]
  );
};

const Tag = styled.div.attrs(props => ({
  style: {
    ...props.style,
    ...variants.caption
  }
}))`
  padding: 1px 4px;
  border-radius: 3px;
  /* border-color: rgba(27, 127, 251, 1); */
  border: 1px solid rgba(46, 50, 53, 1);
  margin: 4px;
  background: ${props => (props.isAssignee ? "rgba(46, 50, 53, 1)" : null)};
  color: ${props => (props.isAssignee ? "white" : "black")};
  display: inline-block;

  &:first-child {
    margin-left: 0px;
    margin-right: 0px;
  }
`;

const TodoItemContainer = styled.div`
  display: flex;

  &:hover {
    background: rgba(0, 0, 0, 0.07);
  }
`;

const TodoItem = ({
  content,
  assignee,
  tags,
  onClick,
  onComplete,
  complete
}) => {
  return (
    <TodoItemContainer style={{ display: "flex", opacity: complete ? 0.5 : 1 }}>
      <div
        style={{ display: "flex", alignItems: "center", padding: 8 }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onComplete();
        }}
      >
        <span className={`${complete ? "fas" : "far"} fa-square fa-fw`} />
      </div>
      <TodoContainer
        onClick={onClick}
        style={{
          flex: 1
        }}
      >
        <Text ui>{content}</Text>
        <div style={{ paddingTop: 2, maxWidth: "100%" }}>
          {assignee && (
            <Tag
              ui
              type="caption"
              style={{ fontWeight: "500" }}
              isAssignee={true}
            >
              {assignee}
            </Tag>
          )}
          {tags.map((tag, i) => {
            return (
              <Tag
                key={tag + i}
                ui
                type="caption"
                style={{ fontWeight: "500" }}
              >
                {tag}
              </Tag>
            );
          })}
        </div>
      </TodoContainer>
    </TodoItemContainer>
  );
};

const NotebarContainer = styled.div`
  width: 350px;
  height: 100%;
  background-color: rgba(255, 255, 255, 1);
  overflow-y: scroll;
  cursor: default;
  user-select: none;
  border-left: 1px solid rgba(218, 218, 218, 1);
  padding: 8px 0px;
`;

const Note = styled.div`
  padding: 4px 8px;
  display: flex;
  background: ${props => (props.selected ? "rgba(46, 50, 53, 1)" : null)};
  color: ${props => (props.selected ? "white" : null)};
  flex-direction: column;
`;

const TaskFilterInput = styled.input.attrs(props => ({
  style: { ...variants.caption, ...props.style }
}))`
  outline: none;
  width: 100%;
  padding: 4px 8px;
  border: 1px solid rgba(46, 50, 53, 1);
  border-radius: 2px;
`;

const App = () => {
  const [noteState, loadingNotes, setNoteState] = useStoredState({
    initialValue: {
      contentById: {},
      notes: [],
      metaById: {},
      activeNoteId: null
    },
    key: "notes-v20"
  });

  const [tagFilterState, loadingTagFilter, setTagFilter] = useStoredState({
    initialValue: {
      tagFilter: ""
    },
    key: "tag-filter-v2",
    mapResult: ({ tagFilter }) => {
      return {
        tagFilterList: tagFilter.split(", ").filter(i => i !== ""),
        tagFilter
      };
    }
  });

  const { tagFilterList, tagFilter } = tagFilterState;

  const onTagFilterChange = useCallback(
    e => setTagFilter({ tagFilter: e.target.value }),
    [setTagFilter]
  );

  const { activeNoteId, contentById, metaById, notes } = noteState;

  const setNoteValue = useNoteUpdate(noteState, setNoteState);

  const content = activeNoteId ? contentById[activeNoteId] : "";

  const setAsComplete = useCallback(({ index, original, noteId }) => {
    const v = contentById[noteId]
      .split("\n")
      .map((l, i) => {
        return index === i ? original.replace("+", "-") : l;
      })
      .join("\n");

    setNoteValue(v, noteId);
  });

  const setAsTodo = useCallback(({ index, original, noteId }) => {
    const v = contentById[noteId]
      .split("\n")
      .map((l, i) => {
        return index === i ? original.replace("-", "+") : l;
      })
      .join("\n");

    setNoteValue(v, noteId);
  });

  const date = activeNoteId
    ? moment(metaById[activeNoteId].updatedAt).format("MMMM D, YYYY @ hh:MM A")
    : "New Note";

  const todo = getTodos(noteState, false).filter(n => {
    let include = tagFilterList.length === 0;
    tagFilterList.forEach(tagFilter => {
      if (tagFilter === "" || n.tags.includes(tagFilter)) {
        include = true;
      }
    });
    return include;
  });
  const completed = getCompleted(noteState, false).filter(n => {
    let include = tagFilterList.length === 0;
    tagFilterList.forEach(tagFilter => {
      if (tagFilter === "" || n.tags.includes(tagFilter)) {
        include = true;
      }
    });
    return include;
  });
  console.log(tagFilterList);

  // console.log(noteState);
  return (
    <ThemeProvider theme={theme}>
      <AppContainer loading={!loaded(loadingNotes, loadingTagFilter)}>
        <Box width="100%" height="100%" flexDirection="row">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              borderRight: "1px solid rgba(218, 218, 218, 1)"
            }}
          >
            <UIRow
              style={{
                justifyContent: "center",
                padding: 4,
                height: 32,
                background: "white",
                fontWeight: "bold"
              }}
            >
              <Text ui type="caption">
                {date}
              </Text>
            </UIRow>
            <Editor
              value={content}
              onChange={e => setNoteValue(e.target.value, activeNoteId)}
            />
          </div>
          <SidebarContainer>
            <SectionTitle label="Tasks" />
            <div style={{ padding: "0px 8px 8px" }}>
              <TaskFilterInput value={tagFilter} onChange={onTagFilterChange} />
            </div>
            <div style={{ paddingBottom: 16 }}>
              {todo.map((r, i) => (
                <TodoItem
                  key={i}
                  onComplete={() => {
                    setAsComplete(r);
                  }}
                  onClick={() =>
                    setNoteState({
                      activeNoteId: r.noteId
                    })
                  }
                  content={r.display}
                  assignee={r.assignee}
                  tags={r.tags}
                />
              ))}
              {completed.map((r, i) => (
                <TodoItem
                  key={i}
                  complete
                  assignee={r.assignee}
                  onComplete={() => setAsTodo(r)}
                  onClick={() =>
                    setNoteState({
                      activeNoteId: r.noteId
                    })
                  }
                  content={r.display}
                  tags={r.tags}
                />
              ))}
            </div>
          </SidebarContainer>
          <NotebarContainer>
            <SectionTitle
              label="Notes"
              actionLabel="Create New Note"
              action={() => setNoteValue("", null)}
            />
            {notes.map(id => {
              return (
                <Note
                  key={id}
                  selected={activeNoteId === id}
                  onClick={() => {
                    setNoteState({
                      activeNoteId: id
                    });
                  }}
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
        </Box>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
