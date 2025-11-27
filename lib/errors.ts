import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class DomainError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DomainError";
    }
}

export class NotFoundError extends Error {
    constructor(message = "Resource not found") {
        super(message);
        this.name = "NotFoundError";
    }
}

export function handleApiError(error: unknown) {
    if (error instanceof ZodError) {
    return NextResponse.json(
            {
                error: {
                code: "VALIDATION_ERROR",
                details: error.message,
                },
            },
            { status: 400 },
        );
    }

    if (error instanceof DomainError) {
        return NextResponse.json(
        {
            error: {
            code: "DOMAIN_ERROR",
            message: error.message,
            },
        },
        { status: 422 }, // Unprocessable Entity
        );
    }

    if (error instanceof NotFoundError) {
    return NextResponse.json(
            {
                error: {
                    code: "NOT_FOUND",
                    message: error.message,
                },
            },
            { status: 404 },
        );
    }

    // fallback for unhandle errors
    console.error("Unhandled API error:", error);
    return NextResponse.json(
        {
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error",
            },
        },
        { status: 500 },
    );
}