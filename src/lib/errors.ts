import { NextResponse } from 'next/server';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409);
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      { 
        error: error.message,
        code: error.statusCode 
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    // Handle Supabase errors
    if ('code' in error && 'details' in error) {
      const supabaseError = error as any;
      
      switch (supabaseError.code) {
        case '23505': // Unique constraint violation
          return NextResponse.json(
            { error: 'Resource already exists' },
            { status: 409 }
          );
        case '23503': // Foreign key constraint violation
          return NextResponse.json(
            { error: 'Invalid reference to related resource' },
            { status: 400 }
          );
        case 'PGRST116': // Row not found
          return NextResponse.json(
            { error: 'Resource not found' },
            { status: 404 }
          );
        default:
          return NextResponse.json(
            { error: 'Database operation failed' },
            { status: 500 }
          );
      }
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

export function validateRequest(schema: any, data: any) {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errorMessages = result.error.errors.map((err: any) => {
      return `${err.path.join('.')}: ${err.message}`;
    }).join(', ');
    
    throw new ValidationError(`Validation failed: ${errorMessages}`);
  }
  
  return result.data;
}
