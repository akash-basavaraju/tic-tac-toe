import React, { useState, useCallback, useRef } from "react";
import Box from "./Box";
import "./Board.css";

const InitialBoardState = [
  [-1, -1, -1],
  [-1, -1, -1],
  [-1, -1, -1]
];

function Board() {
  const [boardState, setBoardState] = useState(InitialBoardState);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [playerScore, setPlayerScore] = useState([0, 0]);
  const filledRef = useRef(0);

  const performLineCheck = useCallback(
    (mBoardState, changedIndex, changedTurn) => {
      let diagonalState = "NONE";
      if (changedIndex[0] === 1 && changedIndex[1] === 1) {
        diagonalState = "BOTH";
      } else if (changedIndex[0] === changedIndex[1]) {
        diagonalState = "LEFT";
      } else if (changedIndex.includes(0) && changedIndex.includes(2)) {
        diagonalState = "RIGHT";
      }

      let rowFlag = true;
      mBoardState[changedIndex[0]].forEach((val) => {
        if (val !== changedTurn) {
          rowFlag = false;
        }
      });

      let columnFlag = true;
      for (let i = 0; i < 3; i++) {
        if (mBoardState[i][changedIndex[1]] !== changedTurn) {
          columnFlag = false;
        }
      }

      let diagonalFlag = diagonalState === "NONE" ? false : true;
      if (["LEFT", "BOTH"].includes(diagonalState)) {
        for (let i = 0; i < 3; i++) {
          if (mBoardState[i][i] !== changedTurn) {
            diagonalFlag = false;
          }
        }
      }
      if (["RIGHT", "BOTH"].includes(diagonalState)) {
        if (mBoardState[0][2] !== changedTurn) {
          diagonalFlag = false;
        } else if (mBoardState[2][0] !== changedTurn) {
          diagonalFlag = false;
        } else if (mBoardState[1][1] !== changedTurn) {
          diagonalFlag = false;
        }
      }

      if (rowFlag || columnFlag || diagonalFlag) {
        const mScore = [...playerScore];
        mScore[currentTurn] = mScore[currentTurn] + 1;
        setPlayerScore(mScore);
        setBoardState(InitialBoardState);
      }
    },
    [playerScore, setBoardState]
  );

  const handleBoxSelect = useCallback(
    (index) => {
      const mBoardState = [...boardState.map((a) => [...a])];

      mBoardState[index[0]][index[1]] = currentTurn;
      setBoardState(mBoardState);
      setCurrentTurn(currentTurn === 1 ? 0 : 1);
      performLineCheck(mBoardState, index, currentTurn);

      filledRef.current = filledRef.current + 1;
      if (filledRef.current === 9) {
        setBoardState(InitialBoardState);
      }
    },
    [currentTurn, performLineCheck, setBoardState]
  );

  return (
    <div className="board_container">
      <div className="board_boxes">
        {boardState.map((row, firstIndex) => {
          return (
            <div className="board_boxes_row">
              {row.map((val, secondIndex) => {
                return (
                  <Box
                    value={val}
                    onClick={handleBoxSelect}
                    index={[firstIndex, secondIndex]}
                    key={`${firstIndex}-${secondIndex}-${val}`}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div> Current Palyer Turn : {currentTurn + 1}</div>
      <div>
        Player Score : Player 1 = {playerScore[0]}, Player 2 = {playerScore[1]}
      </div>
    </div>
  );
}

export default Board;
