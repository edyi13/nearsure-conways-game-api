import { prisma } from "@/infrastructure/prismaClient";
import type { BoardState as DomainBoardState } from "@/core/gameOfLife";

// persisted board state interface
export interface PersistedBoardState {
    boardId: string;
    step: number;
    state: DomainBoardState;
    hash: string;
    createdAt: Date;
}

// heper for mapping database state to domain state
function mapDbStateToDomain(
    board: { id: string; rows: number; columns: number },
    dbState: { step: number; state: string; hash: string; createdAt: Date },
): PersistedBoardState {
    const cells = JSON.parse(dbState.state) as DomainBoardState["cells"];

    const domainState: DomainBoardState = {
        rows: board.rows,
        columns: board.columns,
        cells,
    };

    return {
        boardId: board.id,
        step: dbState.step,
        state: domainState,
        hash: dbState.hash,
        createdAt: dbState.createdAt,
    };
}

// creating a board with an initial state
export async function createBoardWithInitialState(params: {
    initialState: DomainBoardState;
    initialHash: string;
}): Promise<PersistedBoardState> {
    const { initialState, initialHash } = params;

    const created = await prisma.board.create({
        data: {
            rows: initialState.rows,
            columns: initialState.columns,
            states: {
                create: {
                    step: 0,
                    state: JSON.stringify(initialState.cells),
                    hash: initialHash,
                },
            },
        },
    include: {
            states: true,
        },
    })

    const initialDbState = created.states.find((s) => s.step === 0);
    if (!initialDbState) {
        throw new Error("State was not created");
    }

    return mapDbStateToDomain(
        { id: created.id, rows: created.rows, columns: created.columns },
        {
            step: initialDbState.step,
            state: initialDbState.state,
            hash: initialDbState.hash,
            createdAt: initialDbState.createdAt,
        },
    );
}

// fetch the lates board state by boardId
export async function getLatestBoardState(
    boardId: string,
): Promise<PersistedBoardState | null> {
        const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: {
            states: {
                orderBy: { step: "desc" },
                take: 1,
            },
        },
    });

    if (!board || board.states.length === 0) {
        return null;
    }

    const latest = board.states[0];

    return mapDbStateToDomain(
        { id: board.id, rows: board.rows, columns: board.columns },
        {
            step: latest.step,
            state: latest.state,
            hash: latest.hash,
            createdAt: latest.createdAt,
        },
    );
}

// fetch board state by boardId and step
export async function getBoardStateAtStep(params: {
    boardId: string;
    step: number;
}): Promise<PersistedBoardState | null> {
    const { boardId, step } = params;

    const dbState = await prisma.boardState.findFirst({
        where: { boardId, step },
        include: {
            board: true,
        },
    });

    if (!dbState || !dbState.board) {
        return null;
    }

    return mapDbStateToDomain(
        {
            id: dbState.board.id,
            rows: dbState.board.rows,
            columns: dbState.board.columns,
        },
        {
            step: dbState.step,
            state: dbState.state,
            hash: dbState.hash,
            createdAt: dbState.createdAt,
        },
    );
}

// save the state if the boardid exists
export async function saveBoardState(params: {
    boardId: string;
    step: number;
    state: DomainBoardState;
    hash: string;
}): Promise<PersistedBoardState> {
    const { boardId, step, state, hash } = params;

    const board = await prisma.board.findUnique({
        where: { id: boardId },
    });

    if (!board) {
        throw new Error(`The board with id ${boardId} was not found`);
    }

    const createdState = await prisma.boardState.create({
        data: {
            boardId,
            step,
            state: JSON.stringify(state.cells),
            hash,
        },
    });

    return mapDbStateToDomain(
        { id: board.id, rows: board.rows, columns: board.columns },
        {
            step: createdState.step,
            state: createdState.state,
            hash: createdState.hash,
            createdAt: createdState.createdAt,
        },
    );
}

export async function getAllBoardStates(
    boardId: string,
): Promise<PersistedBoardState[]> {
    const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: {
        states: {
            orderBy: { step: "asc" },
        },
        },
    });

    if (!board) {
        return [];
    }

    return board.states.map((s) =>
        mapDbStateToDomain(
            { id: board.id, rows: board.rows, columns: board.columns },
            {
                step: s.step,
                state: s.state,
                hash: s.hash,
                createdAt: s.createdAt,
            },
        ),
    );
}