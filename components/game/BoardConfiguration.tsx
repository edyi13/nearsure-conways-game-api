//  use client directive is necessary for React components that use hooks or other client-side features
// and is required in Next.js 13+ with the app directory structure.
"use client";

type Props = {
    rows: number;
    columns: number;
    onResize: (rows: number, columns: number) => void;
    onReset: () => void;
};

export function BoardConfiguration({ rows, columns, onResize, onReset }: Props) {
    return (
        <section style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "0.5rem" }} >
            <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
                Board configuration
            </h2>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    Rows
                    <input type="number"
                            min={1}
                            max={50}
                            value={rows}
                            onChange={(e) =>
                                onResize(Number(e.target.value) || 1, columns)
                            }
                            style={{ padding: "0.25rem 0.5rem", width: "6rem" }}
                    />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    Columns
                    <input type="number"
                            min={1}
                            max={50}
                            value={columns}
                            onChange={(e) =>
                                onResize(rows, Number(e.target.value) || 1)
                            }
                            style={{ padding: "0.25rem 0.5rem", width: "6rem" }}
                    />
                </label>
            </div>
            <button type="button"
                    onClick={onReset}
                    style={{
                        padding: "0.4rem 0.8rem",
                        borderRadius: "0.4rem",
                        border: "1px solid #ccc",
                        background: "#00BFA5",
                        cursor: "pointer",
                    }}
            >
                Reset grid
            </button>
        </section>
    );
}
