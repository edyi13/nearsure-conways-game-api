// type for the matrix of cells in the board
export type Cells = number[][];

// type for the response from the API
export type BoardStateResponse = {
    boardId?: string;
    step?: number;
    fromStep?: number;
    toStep?: number;
    finalStep?: number;
    state?: {
        rows: number;
        columns: number;
        cells: Cells;
    };
    hash?: string;
    status?: string;
    createdAt?: string;
    error?: {
        code?: string;
        message?: string;
    };
};
