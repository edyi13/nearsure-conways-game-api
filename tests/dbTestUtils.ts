import { prisma } from "@/infrastructure/prismaClient";

export async function resetDatabase() {
    await prisma.boardState.deleteMany({});
    await prisma.board.deleteMany({});
}