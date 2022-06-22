import styled, { keyframes } from 'styled-components';

const blinkingEffect = keyframes`
  from {
    border-color: rgba(7,7,7,1);
  }

  to {
    border-color: rgba(7,7,7,.1);
  }
`;

export const TypeWriterContainer = styled.div<{
  currentDisplay: string;
  blink: boolean;
}>`
  display: inline;
  font-size: inherit;
  color: inherit;
  font-weight: inherit;
  border-right: 0.2rem solid #777;
  width: min-content;
  animation: ${blinkingEffect} 1s linear infinite;
`;
