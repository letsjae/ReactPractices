import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return(
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square 
      key={i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)} />;
  }

  setBoard(){
    let board = []
    for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
      board.push(this.setRows(columnIndex));
    }
    return board;
  }

  setRows(columnIndex) {
      return(
        <div className="board-row">
          {this.setSquares(columnIndex)}
        </div>
      )
  }

  setSquares(columnIndex){
    let row = []
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      let multipliedRowIndex = columnIndex * 3;
      row.push(this.renderSquare(multipliedRowIndex + rowIndex))
    }
    return row;
  }

  render() {
    return (
      <div>
        {this.setBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i){  
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const locationInBoard = getBoardLocation(i);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares:squares,
        locationInBoard: locationInBoard,
      }]),            
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      asc: true
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  descOrder(){
    this.setState({ asc: false})
  }

  ascOrder(){
    this.setState({ asc: true})
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 
      'Go to move #' + move + ', location in board was: ' + step.locationInBoard :
      'Go to game start';

      return (
        <li key={move}>
          <button className="jump-button" onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => { this.handleClick(i)}}
          />
        </div>
        <div className="game-info">
          <div>
            <div> {'Show movements in order: ' }</div>
            <button onClick={() => this.descOrder()}>
              {'Descendent'}
            </button>  
            <button onClick={() => this.ascOrder()}>
              {'Ascendent'}
            </button>  
          </div>
          <div>{status}</div>
          <ol>{this.state.asc ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

function getBoardLocation(i){
    var locationsInBoard = {
      /* 'Array Position' : '(column,row)' */
      0: '(0,0)',
      1: '(1,0)',
      2: '(2,0)',
      3: '(0,1)',
      4: '(1,1)',
      5: '(2,1)',
      6: '(0,2)',
      7: '(1,2)',
      8: '(2,2)',
    }

   return locationsInBoard[i];
}

function calculateWinner(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c] ) {
      return squares[a];
    }    
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);