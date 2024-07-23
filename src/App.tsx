import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import Message, { FloatingMessage, MessagePlaceholder } from './components/Message';
import Button from './components/Button';
import Icon from '@mdi/react';
import { mdiCheck, mdiClose, mdiHeart } from '@mdi/js';
import { getPasta } from './pastaManager';
import React, { useEffect, useState } from 'react';

const TwitchChat = styled.div`
  background-color: #18181b;

  border-width: 0 1px 0 1px;
  border-style: solid;
  border-color: #35353b;

  max-width: 340px;

  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  padding: 20px;
  font-size: 2rem;
  text-align: center;
  font-weight: bold;
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 20px;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
`;

const DropArea = styled.div`
  flex-grow: 1;
  transition: opacity 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  gap: 12px;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
`;

export default function App() {
  const [isFloating, setFloating] = useState(false);
  const [isDropping, setDropping] = useState(false);
  const [isDropped, setDropped] = useState(false);
  const [currentPasta, setCurrentPasta] = useState('');
  const [nextPasta, setNextPasta] = useState('');
  const [prevPasta, setPrevPasta] = useState('');
  const [isOverCondemn, setOverCondemn] = useState(false);
  const [isOverApprove, setOverApprove] = useState(false);
  const [floatingMessagePos, setFloatingMessagePos] = useState([0, 0]);

  useEffect(() => {
    setCurrentPasta(getPasta());
    setNextPasta(getPasta());
  }, []);

  useEffect(() => {
    document.body.style.cursor = isFloating ? 'grabbing' : '';
  }, [isFloating]);

  function sendReaction(positive: boolean) {
    console.log('RECTION SENT', positive);
    setDropped(true);
    setCurrentPasta(nextPasta);
    setNextPasta(getPasta());

    setTimeout(() => {
      setDropped(false);
    }, 300);
  }

  function mouseStopped(e: MouseEvent) {
    e.preventDefault();
    setFloating(false);

    setOverCondemn(val => {
      if (val) sendReaction(true);
      return false;
    });
    setOverApprove(val => {
      if (val) sendReaction(false);
      return false;
    });
    document.removeEventListener('mouseup', mouseStopped);
    document.removeEventListener('mousemove', mouseMoved);
  }

  function mouseMoved(e: MouseEvent) {
    e.preventDefault();
    setFloatingMessagePos([e.clientX, e.clientY]);
  }

  function startFloating(e: React.MouseEvent) {
    e.preventDefault();
    setFloating(true);
    setDropping(false);
    setPrevPasta(currentPasta);
    setFloatingMessagePos([e.clientX, e.clientY]);
    document.addEventListener('mouseup', mouseStopped);
    document.addEventListener('mousemove', mouseMoved);
  }

  const highlightCondemn = (value: boolean) => {
    setOverCondemn(value);
    setDropping(value);
  };
  const highlightApprove = (value: boolean) => {
    setOverApprove(value);
    setDropping(value);
  };
  const theme = useTheme();

  return (
    <>
      <FloatingMessage
        visible={isFloating}
        dropped={isDropping}
        x={floatingMessagePos[0]}
        y={floatingMessagePos[1]}
        username="CopyDePasta"
        content={prevPasta}
      />
      <Container>
        <DropArea
          style={{
            opacity: isFloating ? (isOverCondemn ? 1 : 0.6) : 0,
            color: theme.colors.danger,
            background: theme.colors.danger + '1a'
          }}
          onMouseEnter={() => isFloating && highlightCondemn(true)}
          onMouseLeave={() => isFloating && highlightCondemn(false)}>
          <Icon path={mdiClose} size={6} />
          <span>Осуждаю</span>
        </DropArea>
        <TwitchChat>
          <Title>Pastinder</Title>
          {/* TODO: Переместить за основное сообщение */}
          <MessagePlaceholder>
            <Message
              username="CopyDePasta"
              content={currentPasta}
              style={{
                transform: isDropped ? 'translateY(300px)' : '',
                transition: isDropped ? 'transform .3s, filter .3s' : '',
                filter: isDropped ? '' : 'blur(20px)',
                opacity: isDropped ? 1 : 0
              }}
            />
            <Message
              username="CopyDePasta"
              content={nextPasta}
              style={{
                position: 'absolute',
                width: 340,
                top: 0,
                left: 0,
                filter: 'blur(20px)',
                animation: isDropped ? 'fade-in .3s' : ''
              }}
            />
          </MessagePlaceholder>
          <Message
            username="CopyDePasta"
            content={currentPasta}
            onMouseDown={startFloating}
            style={{
              zIndex: 10,
              opacity: !isDropped ? (!isFloating ? 1 : 0.5) : 0,
              cursor: isFloating ? 'grabbing' : 'grab'
            }}
          />
          <div style={{ flexGrow: 1 }}></div>
          <ButtonsContainer>
            {/* TODO: накинуть sendReaction */}
            <Button variant="danger">Осуждаю</Button>
            <Button background="#e32597">
              <Icon path={mdiHeart} size={0.8} />
            </Button>
            <Button variant="success" darkText>
              Одобряю
            </Button>
          </ButtonsContainer>
        </TwitchChat>
        <DropArea
          style={{
            opacity: isFloating ? (isOverApprove ? 1 : 0.6) : 0,
            color: theme.colors.success,
            background: theme.colors.success + '1a'
          }}
          onMouseEnter={() => isFloating && highlightApprove(true)}
          onMouseLeave={() => isFloating && highlightApprove(false)}>
          <Icon path={mdiCheck} size={6} />
          <span>Одобряю</span>
        </DropArea>
      </Container>
    </>
  );
}
