import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BoardConfiguration } from "@/components/game/BoardConfiguration";

function setup(overrides: Partial<React.ComponentProps<typeof BoardConfiguration>> = {}) {
    const props: React.ComponentProps<typeof BoardConfiguration> = {
        rows: 5,
        columns: 5,
        onResize: vi.fn(),
        onReset: vi.fn(),
        ...overrides,
    };

    const utils = render(<BoardConfiguration {...props} />);
    return { ...utils, props };
}

describe("BoardConfiguration", () => {
    it("calls onResize when changing rows", () => {
        const { getAllByLabelText, props } = setup();

        const rowsInput = getAllByLabelText(/rows/i)[0] as HTMLInputElement;

        fireEvent.change(rowsInput, { target: { value: "10" } });

        expect(props.onResize).toHaveBeenCalledWith(10, 5);
    });

    it("does NOT call onResize when given invalid input", () => {
        const { getAllByLabelText, props } = setup();

        const rowsInput = getAllByLabelText(/rows/i)[0] as HTMLInputElement;

        fireEvent.change(rowsInput, { target: { value: "abc" } });

        expect(props.onResize).not.toHaveBeenCalled();
    });
});
