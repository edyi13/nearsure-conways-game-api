import { describe, it, expect } from "vitest";
import {
  getNextBoardState,
  checkBoardsEquality,
  type BoardState,
} from "@/core/gameOfLife";

describe("Game of Life engine", () => {
    it("mantiene estable un bloque 2x2 (still life)", () => {
        const block: BoardState = {
            rows: 2,
            columns: 2,
            cells: [
                [1, 1],
                [1, 1],
            ],
        };

        const next = getNextBoardState(block);

        expect(checkBoardsEquality(next, block)).toBe(true);
    });

    it("hace oscilar un blinker (periodo 2)", () => {
        const blinkerVertical: BoardState = {
            rows: 3,
            columns: 3,
            cells: [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ],
        };

        const blinkerHorizontal: BoardState = {
            rows: 3,
            columns: 3,
            cells: [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 0],
            ],
        };

        const next = getNextBoardState(blinkerVertical);
        expect(checkBoardsEquality(next, blinkerHorizontal)).toBe(true);

        const back = getNextBoardState(next);
        expect(checkBoardsEquality(back, blinkerVertical)).toBe(true);
    });

    it("mantiene un tablero completamente muerto", () => {
        const dead: BoardState = {
            rows: 3,
            columns: 3,
            cells: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
            ],
        };

        const next = getNextBoardState(dead);

        expect(checkBoardsEquality(next, dead)).toBe(true);
    });

    it("una sola célula viva en 1x1 muere por soledad", () => {
        const single: BoardState = {
            rows: 1,
            columns: 1,
            cells: [[1]],
        };

        const next = getNextBoardState(single);

        expect(next.rows).toBe(1);
        expect(next.columns).toBe(1);
        expect(next.cells).toEqual([[0]]);
    });
});
