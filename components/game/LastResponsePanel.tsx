"use client";

import type { BoardStateResponse } from "@/lib/uiTypes";

type Props = {
    lastResponse: BoardStateResponse | null;
};

// the purpose of this component is to display the last API response in a way that is easy to read and understand
export function LastResponsePanel({ lastResponse }: Props) {
    return (
        <section style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "0.5rem" }} >
            <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
                Last API response
            </h2>
            <pre style={{
                    background: "#ffffffff",
                    padding: "0.75rem",
                    borderRadius: "0.4rem",
                    maxHeight: "260px",
                    overflow: "auto",
                    fontSize: "0.84rem",
                    color: "#333",
                }}
            >
                {
                    lastResponse
                        ? JSON.stringify(lastResponse, null, 2)
                        : "// No calls made yet"
                }
            </pre>
        </section>
    );
}
