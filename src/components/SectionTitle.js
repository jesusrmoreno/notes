import React from "react";
import styled from "styled-components";
import { Text } from './Text';
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

export const SectionTitle = ({ label, actionLabel, action, ...props }) => {
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
