"use client";
import { useBoardSimulation } from "@/hooks/useBoardSimulation";
import { BoardConfiguration } from "@/components/game/BoardConfiguration";
import { BoardGrid } from "@/components/game/BoardGrid";
import { BoardActions } from "@/components/game/BoardActions";
import { LastResponsePanel } from "@/components/game/LastResponsePanel";
import styles from "@/styles/game.module.css";

export default function HomePage() {
  const sim = useBoardSimulation(10, 10);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Conway&apos;s Game of Life</h1>
          <p className={styles.subtitle}>
            Minimal React UI to interact with the Next.js + Prisma API.
          </p>
        </header>

        <BoardConfiguration
          rows={sim.rows}
          columns={sim.columns}
          onResize={sim.resizeGrid}
          onReset={sim.resetBoard}
        />

        <div className={styles.gridWrapper}>
          <BoardGrid cells={sim.cells} onToggleCell={sim.toggleCell} />
        </div>

        <BoardActions
          boardId={sim.boardId}
          loading={sim.loading}
          stepsToAdvance={sim.stepsToAdvance}
          maxStepsFinal={sim.maxStepsFinal}
          onStepsChange={sim.setStepsToAdvance}
          onMaxStepsChange={sim.setMaxStepsFinal}
          onCreateBoard={sim.createBoard}
          onNext={sim.nextState}
          onAdvance={sim.advance}
          onFinal={sim.finalState}
          errorMessage={sim.errorMessage}
          hasUnsavedChanges={sim.hasUnsavedChanges}
        />

        <LastResponsePanel lastResponse={sim.lastResponse} />
      </div>
    </main>
  );
}
