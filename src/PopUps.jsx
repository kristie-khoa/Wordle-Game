import LetterBox from "./LetterBox";

function PopUps({
  isDirectionOpen,
  setIsDirectionOpen,
  isPopUpOpen,
  isGameOver,
  setIsPopUpOpen,
  winCount,
  loseCount,
  reset,
  invalidMessage,
  resultMessage,
  answer,
  winsTracker,
}) {
  const gameStats = winsTracker.map((count, index) => {
    return <p>{`${index + 1}: ${count}`}</p>;
  });

  const winLoseStat = (
    <div className="win-lose-stat">
      <p>Wins: {winCount}</p>
      <p>Losses: {loseCount}</p>
    </div>
  );
  return (
    <>
      {isDirectionOpen && (
        <div className="pop-up-container game-instruction">
          <h2>How To Play</h2>
          <button
            className="exit-button"
            onClick={() => {
              setIsDirectionOpen(false);
            }}
          >
            x
          </button>
          <div className="outline-container">
            <ul>
              <li>Guess the word in 6 tries</li>
              <li>Guesses must be valid 5-letter words</li>
              <div className="example-container">
                <div className="tile-example">
                  <LetterBox char="T" type="tile" colorClass="green" />
                </div>
                <p>"T" is in the word AND in the correct spot</p>
              </div>
              <div className="example-container">
                <div className="tile-example">
                  <LetterBox char="L" type="tile" colorClass="yellow" />
                </div>
                <p>"L" is in the word but NOT in the correct spot</p>
              </div>
              <div className="example-container">
                <div className="tile-example">
                  <LetterBox char="K" type="tile" colorClass="dark-grey" />
                </div>
                <p>"K" is NOT in the word</p>
              </div>
            </ul>
          </div>
        </div>
      )}
      {isPopUpOpen && !isGameOver && (
        <div className="pop-up-container game-stats">
          <button className="exit-button" onClick={() => setIsPopUpOpen(false)}>
            x
          </button>
          <h2>Game Stats</h2>
          {winLoseStat}
          <div className="outline-container">{gameStats}</div>
          <button className="reset-button" onClick={reset}>
            New Game
          </button>
        </div>
      )}
      {invalidMessage && (
        <div className="pop-up-container invalid-message">
          <p>{invalidMessage}</p>
        </div>
      )}
      {isGameOver && isPopUpOpen && (
        <div
          className={`pop-up-container ${
            resultMessage == "YOU WIN" ? "win" : "lose"
          }`}
        >
          <button className="exit-button" onClick={() => setIsPopUpOpen(false)}>
            x
          </button>
          <h2>{resultMessage}</h2>

          <p>answer : {answer}</p>

          {winLoseStat}

          <div className="outline-container">{gameStats}</div>

          <button className="reset-button" onClick={reset}>
            New Game
          </button>
        </div>
      )}
    </>
  );
}

export default PopUps;
