"use client";

import type { BoardStateResponse } from "@/lib/uiTypes";
import React, { memo } from "react";
import styles from "@/styles/game.module.css";


type Props = {
    lastResponse: BoardStateResponse | null;
};

// the purpose of this component is to display the last API response in a way that is easy to read and understand
export const LastResponsePanel = memo(function LastResponsePanel({
    lastResponse,
}: Props) {
    return (
        <section>
            <div className={styles.debugPanel}>
                <h2 className={styles.debugTitle}>Last API response</h2>
                {
                    lastResponse ? (
                        <pre>
                            {JSON.stringify(lastResponse, null, 2)}
                        </pre>
                    ) : (
                        <p className={styles.muted}>No responses yet.</p>
                    )
                }
            </div>
        </section>
    );
});
