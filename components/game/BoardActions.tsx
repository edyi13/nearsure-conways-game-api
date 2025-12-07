// components/game-of-life/BoardActions.tsx
"use client";

type Props = {
    boardId: string | null;
    loading: boolean;
    stepsToAdvance: number;
    maxStepsFinal: number;
    onStepsChange: (value: number) => void;
    onMaxStepsChange: (value: number) => void;
    onCreateBoard: () => void;
    onNext: () => void;
    onAdvance: () => void;
    onFinal: () => void;
    errorMessage: string | null;
};

export function BoardActions({
    boardId,
    loading,
    stepsToAdvance,
    maxStepsFinal,
    onStepsChange,
    onMaxStepsChange,
    onCreateBoard,
    onNext,
    onAdvance,
    onFinal,
    errorMessage,
}: Props) {
    return (
        <section style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "0.5rem" }} >
            <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
                Actions
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "0.75rem" }} >
                <button type="button"
                        onClick={onCreateBoard}
                        disabled={loading}
                        style={{
                            padding: "0.5rem 0.9rem",
                            borderRadius: "0.4rem",
                            border: "1px solid #ccc",
                            background: "#2962FF",
                            color: "#fff",
                            cursor: "pointer",
                            opacity: loading ? 0.7 : 1,
                        }}
                >
                    {
                        boardId ? "Recreate board" : "Create board"
                    }
                </button>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                    <button type="button"
                            onClick={onNext}
                            disabled={!boardId || loading}
                            style={{
                                padding: "0.4rem 0.8rem",
                                borderRadius: "0.4rem",
                                border: "1px solid #ccc",
                                background: "#00BFA5",
                                cursor: boardId && !loading ? "pointer" : "not-allowed",
                                opacity: !boardId || loading ? 0.5 : 1,
                            }}
                    >
                        Next state
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} >
                        <label style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} >
                            Steps
                            <input
                                type="number"
                                min={1}
                                max={1000}
                                value={stepsToAdvance}
                                onChange={(e) =>
                                    onStepsChange(Number(e.target.value) || 1)
                                }
                                style={{ padding: "0.25rem 0.5rem", width: "5rem" }}
                            />
                        </label>
                        <button
                            type="button"
                            onClick={onAdvance}
                            disabled={!boardId || loading}
                            style={{
                                padding: "0.4rem 0.8rem",
                                borderRadius: "0.4rem",
                                border: "1px solid #ccc",
                                background: "#2962FF",
                                cursor: boardId && !loading ? "pointer" : "not-allowed",
                                opacity: !boardId || loading ? 0.5 : 1,
                            }}
                        >
                            Advance
                        </button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} >
                        <label style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} >
                            maxSteps
                            <input
                                type="number"
                                min={1}
                                max={10000}
                                value={maxStepsFinal}
                                onChange={(e) =>
                                    onMaxStepsChange(Number(e.target.value) || 1)
                                }
                                style={{ padding: "0.25rem 0.5rem", width: "6rem" }}
                            />
                        </label>
                        <button
                            type="button"
                            onClick={onFinal}
                            disabled={!boardId || loading}
                            style={{
                                padding: "0.4rem 0.8rem",
                                borderRadius: "0.4rem",
                                border: "1px solid #ccc",
                                background: "#FFAB40",
                                cursor: boardId && !loading ? "pointer" : "not-allowed",
                                opacity: !boardId || loading ? 0.5 : 1,
                            }}
                        >
                            Final state
                        </button>
                    </div>
                </div>
            </div>

            {
                loading && (
                    <p style={{ color: "#555", marginBottom: "0.25rem" }}>Processing...</p>
                )
            }
            {
                errorMessage && (
                    <p style={{ color: "#b00020", marginBottom: "0.25rem" }}>
                        Error: {errorMessage}
                    </p>
                )
            }
            {
                boardId && (
                    <p style={{ color: "#ddd", marginBottom: "0.25rem", fontWeight: 700 }} >
                        Current boardId: <code>{boardId}</code>
                    </p>
                )
            }
        </section>
    );
}
