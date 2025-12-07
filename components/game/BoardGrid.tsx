"use client";

import type { Cells } from "@/lib/uiTypes";

type Props = {
    cells: Cells;
    onToggleCell: (row: number, col: number) => void;
};

export function BoardGrid({ cells, onToggleCell }: Props) {
    return (
        <section style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "0.5rem" }} >
            <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
                Board editor
            </h2>
            <p style={{ marginBottom: "0.5rem", color: "#ddd", fontWeight: 700 }}>
                Click cells to toggle between alive (1) and dead (0).
            </p>

            <div style={{  display: "inline-block", border: "1px solid #ccc", borderRadius: "0.5rem" }} >
                {
                    cells.map((row, rIdx) => (
                        <div key={rIdx} style={{ display: "flex" }}>
                            {
                                row.map((value, cIdx) => (
                                    <button key={cIdx}
                                            type="button"
                                            onClick={() => onToggleCell(rIdx, cIdx)}
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                                border: "1px solid #ddd",
                                                padding: 0,
                                                background: value === 1 ? "#222" : "#fff",
                                                cursor: "pointer",
                                            }}
                                            aria-label={`Cell ${rIdx},${cIdx}, value ${value}`}
                                    />
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        </section>
    );
}
