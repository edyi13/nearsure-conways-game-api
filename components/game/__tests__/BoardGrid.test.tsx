import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BoardGrid } from "../BoardGrid";

describe("BoardGrid", () => {
    it("renders cells and calls onToggleCell when clicked", () => {
        const cells = [
            [0, 1],
            [1, 0],
        ];
        const onToggleCell = vi.fn();

        const { getAllByRole } = render(
            <BoardGrid cells={cells} onToggleCell={onToggleCell} />
        );

        const buttons = getAllByRole("button");
        expect(buttons).toHaveLength(4);

        fireEvent.click(buttons[1]); // row 0, col 1
        expect(onToggleCell).toHaveBeenCalledWith(0, 1);
    });
});
