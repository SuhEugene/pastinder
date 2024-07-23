import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';

const ButtonCore = styled.button`
  padding: 0 1rem;
  height: 30px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: filter 0.13s;
  will-change: filter;
  &:hover {
    filter: brightness(0.8);
  }
`;

type ThemeColor = keyof ReturnType<typeof useTheme>['colors'];

interface ButtonProps {
  variant?: ThemeColor;
  background?: string;
  darkText?: boolean;
  label?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, background, darkText, label, children }) => {
  const theme = useTheme();
  return (
    <ButtonCore
      style={{
        backgroundColor: background || theme.colors[variant || 'secondary'],
        color: darkText ? '#000000' : ''
      }}>
      {label || children}
    </ButtonCore>
  );
};

export default Button;
