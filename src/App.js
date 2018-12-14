import React, { useCallback, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { Text, variants } from "./components/Text";
import { SectionTitle } from "./components/SectionTitle";
import { Editor } from "./components/Editor";
import { NotesColumn } from "./components/NotesColumn";
import { useStoredState } from "./util/useStoredState";
import uuid from "uuid/v4";
import moment from "moment";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import { Sidebar } from "./components/Sidebar";
const theme = {
  textDefault: "rgba(0, 0, 0, .87)",
  textLight: "rgba(0, 0, 0, .52)"
};

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  opacity: ${props => (props.loading ? 0 : 1)};
  transition: opacity 50ms;
  display: flex;
  flex-direction: column;
  background: rgba(18, 18, 18, 1);
`;

const UIRow = styled.div`
  padding: 0px 8px;
  height: 24px;
  align-items: center;
  display: flex;
  color: ${props => props.theme.textLight};
`;

const SidebarContainer = styled.div`
  background-color: rgba(252, 252, 252, 1);
  width: 350px;
  min-width: 350px;
  height: 100%;
  overflow-y: scroll;
  cursor: default;
  user-select: none;
  border-left: 1px solid rgba(218, 218, 218, 1);
  padding: 8px 0px;
`;

const loaded = (...args) => !args.filter(v => v).length;

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
    (value, id, setAsActive = false) => {
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
        activeNoteId: setAsActive ? noteId : noteState.activeNoteId || noteId,
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
    [noteState, setNoteState]
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
  border: 1px solid;
  border-color: ${props =>
    props.isAssignee ? "rgba(50, 123, 185, 1)" : " rgba(46, 50, 53, 1)"};
  margin-right: 4px;
  background: ${props => (props.isAssignee ? "rgba(50, 123, 185, 1)" : null)};
  color: ${props => (props.isAssignee ? "white" : "black")};
  display: inline-block;
`;

const TodoItemWrapper = styled.div`
  padding: 8px;
`;

const TodoContainer = styled.div`
  padding: 8px 8px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const TodoItemContainer = styled.div`
  display: flex;
  padding: 8;
  /* border: 1px solid rgba(218, 218, 218, 1); */
  border-radius: 3px;
  overflow: hidden;

  &:hover {
    background: rgba(245, 245, 245, 1);
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
    <TodoItemWrapper>
      <TodoItemContainer
        style={{ display: "flex", opacity: complete ? 0.5 : 1 }}
      >
        {/* <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "black",
          flex: 1,
          maxWidth: 32
        }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onComplete();
        }}
      >
        <span className={`${complete ? "fas" : "far"} fa-circle fa-fw`} />
      </div> */}
        <TodoContainer
          onClick={onClick}
          style={{
            flex: 1
          }}
        >
          <Text ui style={{ lineHeight: "1", paddingBottom: 4 }}>
            {content}
          </Text>
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
    </TodoItemWrapper>
  );
};

const TaskFilterInput = styled.input.attrs(props => ({
  style: { ...variants.caption, ...props.style }
}))`
  outline: none;
  width: 100%;
  padding: 4px 8px;
  border: 1px solid rgba(46, 50, 53, 1);
  border-radius: 2px;
`;

const Toolbar = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: rgba(237, 237, 237, 1);
  border-bottom: 1px solid rgba(218, 218, 218, 1);
`;

const ToolbarButtonContainer = styled.div`
  max-height: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 8px;
  margin: 0px 8px;
  border: 1px solid rgba(218, 218, 218, 1);
  border-radius: 4px;
  transition: all 100ms;
  font-size: 0.8em;
  &:hover {
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.27);
  }
`;

const ToolbarButton = ({ icon, action }) => {
  return (
    <ToolbarButtonContainer onClick={action}>
      <span className={`fa fa-fw ${icon}`} />
    </ToolbarButtonContainer>
  );
};

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
      if (
        tagFilter === "" ||
        n.tags.includes(tagFilter) ||
        n.assignee === tagFilter
      ) {
        include = true;
      }
    });
    return include;
  });

  const completed = getCompleted(noteState, false).filter(n => {
    let include = tagFilterList.length === 0;
    tagFilterList.forEach(tagFilter => {
      if (
        tagFilter === "" ||
        n.tags.includes(tagFilter) ||
        n.assignee === tagFilter
      ) {
        include = true;
      }
    });
    return include;
  });

  const createNewNote = useCallback(() => setNoteValue("", null, true), [
    setNoteValue
  ]);

  return (
    <ThemeProvider theme={theme}>
      <AppContainer loading={!loaded(loadingNotes, loadingTagFilter)}>
        <div
          style={{
            display: "flex",
            flex: 1,
            height: "100%"
          }}
        >
          <Sidebar createNewNote={createNewNote} />
          <Editor
            value={content}
            date={date}
            onChange={e => setNoteValue(e.target.value, activeNoteId)}
          />
          {/* <NotesColumn
            notes={notes}
            activeNoteId={activeNoteId}
            onNoteClick={id =>
              setNoteState({
                activeNoteId: id
              })
            }
            contentById={contentById}
            metaById={metaById}
          />

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
          </SidebarContainer> */}
        </div>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
