export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationResult {
  errors: ValidationError[] = [];
  
  addError(field: string, message: string) {
    this.errors.push({ field, message });
  }
  
  get isValid(): boolean {
    return this.errors.length === 0;
  }
  
  get errorMessage(): string {
    return this.errors.map(e => `${e.field}: ${e.message}`).join(', ');
  }
}

// Common validation functions
export function validateRequired(value: any, field: string, result: ValidationResult): void {
  if (value === null || value === undefined || value === '') {
    result.addError(field, 'is required');
  }
}

export function validateString(value: any, field: string, result: ValidationResult, maxLength?: number): void {
  if (typeof value !== 'string') {
    result.addError(field, 'must be a string');
    return;
  }
  
  if (maxLength && value.length > maxLength) {
    result.addError(field, `must be ${maxLength} characters or less`);
  }
}

export function validateEnum<T extends string>(value: any, field: string, validValues: T[], result: ValidationResult): void {
  if (!validValues.includes(value)) {
    result.addError(field, `must be one of: ${validValues.join(', ')}`);
  }
}

export function validateUUID(value: any, field: string, result: ValidationResult): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (typeof value !== 'string' || !uuidRegex.test(value)) {
    result.addError(field, 'must be a valid UUID');
  }
}

export function sanitizeString(value: string): string {
  // Remove any potential XSS attempts
  return value
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

// Validation schemas for different endpoints
export function validateSongGenerationRequest(data: any): ValidationResult {
  const result = new ValidationResult();

  validateRequired(data.stopName, 'stopName', result);
  validateString(data.stopName, 'stopName', result, 100);

  validateRequired(data.genre, 'genre', result);
  validateEnum(data.genre, 'genre',
    ['rock', 'pop', 'country', 'electronic', 'folk', 'hip-hop', 'jazz', 'indie', 'blues', 'custom', 'Custom'],
    result
  );

  validateRequired(data.userId, 'userId', result);
  validateUUID(data.userId, 'userId', result);

  validateRequired(data.songId, 'songId', result);
  validateUUID(data.songId, 'songId', result);

  if (data.stories) {
    validateString(data.stories, 'stories', result, 1000);
  }

  if (data.people) {
    validateString(data.people, 'people', result, 200);
  }

  // Optional: mood validation
  if (data.mood) {
    validateString(data.mood, 'mood', result, 50);
    validateEnum(data.mood, 'mood',
      ['upbeat', 'chill', 'nostalgic', 'adventurous', 'romantic', 'funny'],
      result
    );
  }

  // Optional: custom style validation (for Custom genre)
  if (data.customStyle) {
    validateString(data.customStyle, 'customStyle', result, 500);
  }

  // Optional: custom lyrics validation
  if (data.customLyrics) {
    validateString(data.customLyrics, 'customLyrics', result, 3000);
  }

  return result;
}

export function validateArtworkGenerationRequest(data: any): ValidationResult {
  const result = new ValidationResult();
  
  validateRequired(data.prompt, 'prompt', result);
  validateString(data.prompt, 'prompt', result, 1000);
  
  if (data.type) {
    validateEnum(data.type, 'type', ['song', 'trip'], result);
  }
  
  if (data.width) {
    if (typeof data.width !== 'number' || data.width < 64 || data.width > 4096) {
      result.addError('width', 'must be a number between 64 and 4096');
    }
  }
  
  if (data.height) {
    if (typeof data.height !== 'number' || data.height < 64 || data.height > 4096) {
      result.addError('height', 'must be a number between 64 and 4096');
    }
  }
  
  return result;
}

export function validateCreditPurchaseRequest(data: any): ValidationResult {
  const result = new ValidationResult();
  
  validateRequired(data.packageType, 'packageType', result);
  validateEnum(data.packageType, 'packageType', ['starter', 'popular', 'premium'], result);
  
  if (data.mode) {
    validateEnum(data.mode, 'mode', ['payment', 'embedded'], result);
  }
  
  return result;
}