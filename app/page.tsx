// export default function Home() {
//   return (
//     <main className="min-h-screen p-8">
//       <h1 className="text-2xl font-bold mb-4">
//         Conways Game of Life API & UI
//       </h1>
//       <p className="mb-2">
//         This is a code challenge implementation. Use the UI to create a board
//         and interact with the API.
//       </p>
//       <p>We will add the actual UI here later.</p>
//     </main>
//   );
// }

"use client";

import { useBoardSimulation } from "@/hooks/useBoardSimulation";
import { BoardConfiguration } from "@/components/game/BoardConfiguration";
import { BoardGrid } from "@/components/game/BoardGrid";
import { BoardActions } from "@/components/game/BoardActions";
import { LastResponsePanel } from "@/components/game/LastResponsePanel";

export default function HomePage() {
  const sim = useBoardSimulation(20, 20);

  return (
    <main
      style={{ padding: "1.5rem", maxWidth: "960px", margin: "0 auto", fontFamily: "sans-serif" }}
    >
      <h1 style={{ fontSize: "1.8rem", fontWeight: 600,  marginBottom: "0.5rem" }} >
        Conways Game of Life API Demo
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#ffffffff", fontWeight: 500 }} >
        Simple React UI to interact with the Game of Life API: create a board,
        compute next states, advance multiple steps, and request a final state.
      </p>

      <BoardConfiguration
        rows={sim.rows}
        columns={sim.columns}
        onResize={sim.resizeGrid}
        onReset={sim.resetBoard}
      />

      <BoardGrid cells={sim.cells} onToggleCell={sim.toggleCell} />

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
      />

      <LastResponsePanel lastResponse={sim.lastResponse} />
    </main>
  );
}
