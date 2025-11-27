// 0 dead cell, 1 alive cell
export type Cell = 0 | 1;
export interface BoardState {
    cells: Cell[][];
    rows: number;
    columns: number;
}

// counts the number of alive neighbors for a given cell
function getCountAliveNeighbors(board: BoardState, row: number, col: number): number { 
    const { cells, rows, columns } = board;
    let count = 0;
    for(let r = -1; r <= 1; r++) {
        for(let c = -1; c <= 1; c++) {
            // skip current cell
            if(r === 0 && c === 0) {
                continue;
            }
            const nr = row + r;
            const nc = col + c;
            // ignore positions outside the board
            if(nr < 0 || nr >= rows || nc < 0 || nc >= columns) {
                continue;
            }
            // add to count if neighbor is alive
            count += cells[nr][nc];
        }

    }
    return count;
}

export function getNextBoardState(currentBoard: BoardState): BoardState {
    const { cells, rows, columns } = currentBoard;
    const newCells: Cell[][] = Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, col) => {
        const alive = cells[row][col];
        const neighborsAlive = getCountAliveNeighbors(currentBoard, row, col);
        // if alive and has 2 or 3 alive neighbors, stays alive
        if(alive && (neighborsAlive === 2 || neighborsAlive === 3)) {
            return 1;
        }
        
        // if dead and 3 alive neighbors, then becomes alive
        if(!alive && neighborsAlive === 3) {
            return 1; // dead cell with exactly 3 alive neighbors becomes alive
        }        

        // else dies or stays dead
        return 0;
    }));
    return { cells: newCells, rows, columns };
}

export function checkBoardsEquality(boardA: BoardState, boardB: BoardState): boolean {
    if(boardA.rows !== boardB.rows || boardA.columns !== boardB.columns) {
        return false;
    }

    for(let r = 0; r < boardA.rows; r++){
        for(let c = 0; c < boardA.columns; c++) {
            if(boardA.cells[r][c] !== boardB.cells[r][c]) {
                return false;
            }
        }
    }
    return true;
}