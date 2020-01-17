import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/** Features:
 * Display the location for each move in the format (col, row) in the move history list.
Bold the currently selected item in the move list.
A clock limit of 10 seconds per player
Rewrite Board to use two loops to make the squares instead of hardcoding them.
Add a toggle button that lets you sort the moves in either ascending or descending order.
When someone wins, highlight the three squares that caused the win.
When no one wins, display a message about the result being a draw.
 */

function Square(props) {

    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

   
  
  
  class Board extends React.Component {

    renderSquare(i) {
      return (
            <Square 
                    value={this.props.squares[i]}
                    onClick={() => this.props.onClick(i)} 
      />);
      // passing a prop called value to square
    }

    renderRow(i) {  
      const arr = [0,1,2];
      const row = arr.map((val,j) => {
        return (
          this.renderSquare(i * 3 + j)
        );
      });

      return row;
    }

  
  
    render() {
      const arr = [0,1,2];
      const board = arr.map((val, i) => {
        return (
          <div className="board-row">
              {this.renderRow(i)}
            </div>
        );
      });
      
      return (
        <div>
          {board}
        </div>
      );
    }

  
  }
  
  class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            history: [

            {
                moveRow: 0,
                moveColumn: 0,
                squares: Array(9).fill(null),
            }
        ],
            clickedMove: -1,
            stepNumber: 0,
            xIsNext: true,
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            clickedMove: step
        });
      
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const row = parseInt(i / 3) + 1;
        const col = (i % 3) + 1;
        this.setState({
            history: history.concat([{
                moveRow: row,
                moveColumn: col,
                squares: squares,

            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const clickedMove = this.state.clickedMove;
        // 0 if no one won, 1 is someone won, 2 is draw

        const moves = history.map((step, move) => {
            const desc = move ?
            `Go back to move # ${move} made at (row,col) = (${history[move].moveRow}, ${history[move].moveColumn})` : 
            'Go to game start';
            let className = "move";
            if (move === clickedMove) {
              className = "move_curr";
            }
            return (
                <li key={move}>
                    <button className={className} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
            
            
        });

        let status;
        if (winner) {
            status = winner + ' has won!';
        } else {
            const draw = checkDraw(current.squares);
            if (!draw) {
              status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
            else {
              status = 'Draw Game!';
            }
            
        }
      return (
        <div className="game">
          <h1>Tic Tac Toe Supreme</h1>
          <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div className="status">{status}</div>
            <ol className="moves">{moves}</ol>
            
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
      const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6,7,8],
          [0,3,6],
          [1,4,7],
          [2,5,8],
          [0,4,8],
          [2,4,6],
      ];
      
      for (let i = 0; i < lines.length; i++) {
          const [a,b,c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
              return squares[a];
          }
      }
  
      return null;
  }

  function checkDraw(squares) {
    let draw = true;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        draw = false;
      }
    }
    return draw;
  }

  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  