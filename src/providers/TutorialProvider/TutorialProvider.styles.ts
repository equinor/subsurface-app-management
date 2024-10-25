import { Dialog, Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';

import styled, { keyframes } from 'styled-components';

const { elevation, shape, spacings } = tokens;

const fadeinBoxShadowAnimation = keyframes`
  from {
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0);
  }
  to {
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.3);
  }
`;

export const Highlighter = styled.div`
  position: absolute;
  z-index: 10000;
  pointer-events: none;
  transition: top, left, width, height;
  transition-duration: 300ms;
  border-radius: 4px;
  animation: ${fadeinBoxShadowAnimation} 300ms;
  animation-fill-mode: forwards;
`;

export const DialogWrapper = styled.div`
  position: absolute;
  right: 24px;
  bottom: 24px;
  background: transparent;
`;

const fadeinOpacityAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const StyledTutorialDialog = styled.dialog`
  border: none;
  box-shadow: ${elevation.above_scrim};
  border-radius: ${shape.corners.borderRadius};
  transition: all;
  transition-duration: 300ms;
  animation: ${fadeinOpacityAnimation} 300ms;
  animation-fill-mode: forwards;
  &::backdrop {
    background: transparent;
  }
`;

export const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacings.comfortable.large};
  width: fit-content;
`;

export const DialogTypography = styled(Typography)`
  width: 300px;
`;

export const DialogImage = styled.img`
  max-height: 300px;
  min-height: 50px;
  max-width: 300px;
  object-fit: contain;
`;

export const DialogActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const NavigateSteps = styled.div`
  display: flex;
  gap: ${spacings.comfortable.medium};
`;

export const TutorialErrorDialog = styled(Dialog)`
  width: 300px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  padding: ${spacings.comfortable.medium};
  gap: ${spacings.comfortable.large};
  button {
    align-self: flex-end;
  }
`;
