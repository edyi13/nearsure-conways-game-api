"use client";
import React, { memo } from "react";
import type { Cells } from "@/lib/uiTypes";
import styles from "@/styles/game.module.css";


type Props = {
    cells: Cells;
    onToggleCell: (row: number, col: number) => void;
};

export const BoardGrid = memo(function BoardGrid({
    cells,
    onToggleCell,
}: Props) {
    return (
        <div className={styles.grid}>
        {
            cells.map((row, rIdx) => (
                <div key={rIdx} className={styles.gridRow}>
                {
                    row.map((value, cIdx) => {
                        const isAlive = value === 1;
                        const cellClassName = isAlive
                            ? `${styles.gridCell} ${styles.gridCellAlive}`
                            : styles.gridCell;

                        return (
                            <button
                                key={cIdx}
                                type="button"
                                className={cellClassName}
                                onClick={() => onToggleCell(rIdx, cIdx)}
                            />
                        );
                    })
                }
                </div>
            ))
        }
        </div>
    );
});
