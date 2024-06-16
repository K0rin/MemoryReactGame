import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle
} from "@material-ui/core";
import Card from "./card";
import "./app.scss";

const uniqueCardsArray = [
  {
    type: "Agumon",
    image: require(`./images/Agumon.jpg`)
  },
  {
    type: "Patamon",
    image: require(`./images/Patamon.jpg`)
  },
  {
    type: "Tailmon",
    image: require(`./images/Tailmon.jpg`)
  },
  {
    type: "Piyomon",
    image: require(`./images/Piyomon.jpg`)
  },
  {
    type: "Gabumon",
    image: require(`./images/Gabumon.png`)
  },
  {
    type: "Palmon",
    image: require(`./images/Palmon.jpg`)
  },
  {
    type: "Tentomon",
    image: require(`./images/Tentomon.png`)
  },
  {
    type: "Gomamon",
    image: require(`./images/Gomamon.jpg`)
  }
];

function mixCards(array) {
  const length = array.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

export default function App() {
  const [cards, setCards] = useState(() =>
    mixCards(uniqueCardsArray.concat(uniqueCardsArray))
  );
  const [openCards, setOpenCards] = useState([]);
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });
  const [clearedCards, setClearedCards] = useState({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bestScore, setBestScore] = useState(
    JSON.parse(localStorage.getItem("bestScore")) || Number.POSITIVE_INFINITY
  );
  const [bestTime, setBestTime] = useState(
    JSON.parse(localStorage.getItem("bestTime")) || { minutes: 99, seconds: 59 }
  );
  const [currentTime, setCurrentTime] = useState({ minutes: 0, seconds: 0 });
  const timeout = useRef(null);

  const disable = () => {
    setShouldDisableAllCards(true);
  };

  const enable = () => {
    setShouldDisableAllCards(false);
  };

  const checkGameEnd = () => {
    if (Object.keys(clearedCards).length === uniqueCardsArray.length) {
      setShowModal(true);
      const highScore = Math.min(moves, bestScore);
      setBestScore(highScore);
      localStorage.setItem("bestScore", highScore);
      updateBestTime(time); 
      setCurrentTime(time); 
    }
  };

  const updateBestTime = (currentTime) => {
    if (
      currentTime.minutes < bestTime.minutes ||
      (currentTime.minutes === bestTime.minutes && currentTime.seconds < bestTime.seconds)
    ) {
      setBestTime(currentTime);
      localStorage.setItem("bestTime", JSON.stringify(currentTime));
    }
  };

  const checkTwoCards = () => {
    const [first, second] = openCards;
    enable();
    if (cards[first].type === cards[second].type) {
      setClearedCards((prev) => ({ ...prev, [cards[first].type]: true }));
      setOpenCards([]);
      return;
    }
    // This is to flip the cards back after 500ms duration
    timeout.current = setTimeout(() => {
      setOpenCards([]);
    }, 500);
  };

  const CardClickHandler = (index) => {
    if (openCards.length === 1) {
      setOpenCards((prev) => [...prev, index]);
      setMoves((moves) => moves + 1);
      disable();
    } else {
      clearTimeout(timeout.current);
      setOpenCards([index]);
    }
  };

  useEffect(() => {
    let timeout = null;
    if (openCards.length === 2) {
      timeout = setTimeout(checkTwoCards, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [openCards]);

  useEffect(() => {
    checkGameEnd();
  }, [clearedCards]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => {
        const seconds = prevTime.seconds + 1;
        const minutes = prevTime.minutes + Math.floor(seconds / 60);
        return {
          minutes: minutes,
          seconds: seconds % 60
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const checkIsFlipped = (index) => {
    return openCards.includes(index);
  };

  const checkIsInactive = (card) => {
    return Boolean(clearedCards[card.type]);
  };

  const RestartButtonHundler = () => {
    setClearedCards({});
    setOpenCards([]);
    setShowModal(false);
    setMoves(0);
    setShouldDisableAllCards(false);
    setTime({ minutes: 0, seconds: 0 });
    // set a shuffled deck of cards
    setCards(mixCards(uniqueCardsArray.concat(uniqueCardsArray)));
  };

  return (
    <div className="App">
      <header>
        <h3>Play the Memory card game</h3>
        <div>
          Select two cards with same content consequtively to make them vanish
        </div>
      </header>
      <div className="container">
        {cards.map((card, index) => {
          return (
            <Card
              key={index}
              card={card}
              index={index}
              isDisabled={shouldDisableAllCards}
              isCoverFace={checkIsInactive(card)}
              isFrontFace={checkIsFlipped(index)}
              onClick={CardClickHandler}
            />
          );
        })}
      </div>
      <div className="timer">
        {String(time.minutes).padStart(2, '0')}:
        {String(time.seconds).padStart(2, '0')}
      </div>
      <footer>
        <div className="score">
          <div className="moves">
            <span className="bold">Moves:</span> {moves}
          </div>
          {localStorage.getItem("bestScore") && (
            <div className="high-score">
              <span className="bold">Best Score:</span> {bestScore}
            </div>
          )}
          {localStorage.getItem("bestTime") && (
            <div className="best-time">
              <span className="bold">Best Time:</span> {String(bestTime.minutes).padStart(2, '0')}:{String(bestTime.seconds).padStart(2, '0')}
            </div>
          )}
        </div>
        <div className="restart">
          <Button onClick={RestartButtonHundler} color="primary" variant="contained">
            Restart
          </Button>
        </div>
      </footer>
      <Dialog
        open={showModal}
        disableBackdropClick
        disableEscapeKeyDown
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Hurray!!! You completed the challenge
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You completed the game in {moves} moves and {String(currentTime.minutes).padStart(2, '0')}:{String(currentTime.seconds).padStart(2, '0')}. Your best score is {bestScore} moves and best time is {String(bestTime.minutes).padStart(2, '0')}:{String(bestTime.seconds).padStart(2, '0')}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={RestartButtonHundler} color="primary" autoFocus>
            Restart
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
