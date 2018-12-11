import { variants } from "./Text";
import styled from "styled-components";

const Input = styled.input.attrs(props => ({
  style: { ...variants.body, ...props.style }
}))`
  width: 100%;
  outline: none;
  border: none;
  padding: 4px 8px;
  border: 1px solid #d8d8d8;
  border-radius: 2px;
  transition: 100ms;
  color: ${props => (props.invalid ? "#d4403c" : "rgba(0, 0, 0, 0.82)")};
  border-color: ${props => (props.invalid ? "#d4403c" : "#d8d8d8")};

  &:disabled {
    background-color: #eeeeee;
    color: #eeeeee;
    user-select: none;
  }

  &:focus {
    border-color: ${props => (props.invalid ? "#d4403c" : "#979797")};
  }
`;

export const TextArea = styled.textarea.attrs(props => ({
  style: { ...variants.body, ...props.style }
}))`
  width: 100%;
  outline: none;
  border: none;
  padding: 4px 8px;
  border: 1px solid #d8d8d8;
  border-radius: 2px;
  transition: 100ms;
  color: ${props => (props.invalid ? "#d4403c" : "rgba(0, 0, 0, 0.82)")};
  border-color: ${props => (props.invalid ? "#d4403c" : "#d8d8d8")};

  &:disabled {
    background-color: #eeeeee;
    color: #eeeeee;
    user-select: none;
  }

  &:focus {
    border-color: ${props => (props.invalid ? "#d4403c" : "#979797")};
  }
`;

export default Input;
