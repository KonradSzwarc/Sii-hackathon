import styled from 'styled-components';
import { colorPalette } from '../../utils/constants/styles';

export const AppName = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: ${colorPalette.primary2Color};
  display: flex;
  align-items: center;
  padding: 0 40px;
  font-size: 24px;
  font-weight: 300;
  color: #fff;
`;

export const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

export const Body = styled.div`
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar {
    width: 8px;
    background-color: #f5f5f5;

    @media (max-width: 700px) {
      display: none;
    }
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #757575;
  }
`;
