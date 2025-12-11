import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BoardActions } from "../BoardActions";

function setup(overrides: Partial<React.ComponentProps<typeof BoardActions>> = {}) {
    const props: React.ComponentProps<typeof BoardActions> = {
        boardId: "board-1",
        loading: false,
        stepsToAdvance: 5,
        maxStepsFinal: 100,
        onStepsChange: vi.fn(),
        onMaxStepsChange: vi.fn(),
        onCreateBoard: vi.fn(),
        onNext: vi.fn(),
        onAdvance: vi.fn(),
        onFinal: vi.fn(),
        errorMessage: null,
        hasUnsavedChanges: false,
        ...overrides,
    };

    const utils = render(<BoardActions {...props} />);
    return { ...utils, props };
}

describe("BoardActions", () => {
    it("disables simulation buttons when there is no boardId", () => {
        const { getAllByText } = setup({ boardId: null });

        const nextBtn = getAllByText("Next")[0] as HTMLButtonElement;
        const advanceBtn = getAllByText("Advance")[0] as HTMLButtonElement;
        const finalBtn = getAllByText("Final")[0] as HTMLButtonElement;

        expect(nextBtn.disabled).toBe(true);
        expect(advanceBtn.disabled).toBe(true);
        expect(finalBtn.disabled).toBe(true);
    });

    it("disables simulation buttons when there are unsaved changes", () => {
        const { getAllByText } = setup({ hasUnsavedChanges: true });

        const nextBtn = getAllByText("Next")[0] as HTMLButtonElement;
        const advanceBtn = getAllByText("Advance")[0] as HTMLButtonElement;
        const finalBtn = getAllByText("Final")[0] as HTMLButtonElement;

        expect(nextBtn.disabled).toBe(true);
        expect(advanceBtn.disabled).toBe(true);
        expect(finalBtn.disabled).toBe(true);
    });
});
