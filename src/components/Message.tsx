import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

const MessageContainer = styled.div`
  word-break: break-word;
  overflow-wrap: break-word;

  padding: 20px;
  font-size: 13px;

  display: flex;
  justify-content: center;
  align-items: center;
  &:not(.narrow) {
    height: 300px;
    flex-basis: 300px;
  }
`;

const MessageUsername = styled.span`
  color: #daa520;
  font-weight: 700;
`;

const MessageText = styled.span``;

interface MessageProps {
  username: React.ReactNode;
  content?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  narrow?: boolean;
  onMouseDown?: React.MouseEventHandler;
}

const Message: React.FC<MessageProps> = ({
  username,
  content,
  narrow,
  children,
  ...rest
}) => {
  return (
    <MessageContainer {...rest} className={narrow ? 'narrow' : ''}>
      <div>
        <MessageUsername>{username}</MessageUsername>
        <span>: </span>
        <MessageText>{content || children}</MessageText>
      </div>
    </MessageContainer>
  );
};

export default Message;

export const MessagePlaceholder = ({ height, children }: { height?: number, children?: React.ReactNode }) => {
  return <div style={{ height: height || 300, position: 'relative' }}>{children}</div>;
};

interface FloatingMessageProps extends MessageProps {
  x: number;
  y: number;
  visible: boolean;
  dropped: boolean;
}

const FloatingMessageContainer = styled.div`
  position: fixed;
  width: 340px;
  background-color: #18181ba0;
  border-radius: 8px;
  border: 1px solid #35353b;
  backdrop-filter: blur(12px);
  z-index: 15;
  cursor: grabbing;
  pointer-events: none;
`;

export const FloatingMessage: React.FC<FloatingMessageProps> = ({
  x,
  y,
  visible,
  dropped,
  ...rest
}) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [isRendered, setRendered] = useState(false);
  const [renderTimeout, setRenderTimeout] = useState<number>(0);

  const updateWindowWidth = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', updateWindowWidth);
    updateWindowWidth();

    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);

  const halfWidth = windowWidth / 2;

  useEffect(() => {
    if (renderTimeout) {
      clearTimeout(renderTimeout);
      setRenderTimeout(0);
    }

    if (!visible && dropped) {
      setRenderTimeout(
        setTimeout(() => {
          setRendered(false);
        }, 300)
      );
      return;
    }

    setRendered(visible);
  }, [visible, dropped]);

  return (
    <>
      {isRendered ? (
        <FloatingMessageContainer
          style={{
            top: y - 20,
            left: x - 170,
            transform: `translateY(${!visible ? '30px' : 0}) rotate(${((halfWidth - x) / halfWidth) * 30}deg)`,
            opacity: !visible ? 0 : 1,
            transition: !visible ? 'transform .3s, opacity .3s' : ''
          }}>
          <Message {...rest} narrow />
        </FloatingMessageContainer>
      ) : (
        <></>
      )}
    </>
  );
};
