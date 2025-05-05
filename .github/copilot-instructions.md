## 1. Hep Türkçe cevap ver

Bu doküman kapsamında yapılacak tüm iletişim, kod yorumları ve açıklamalar Türkçe dilinde olmalıdır. Geliştirme sürecinde kullanılacak terimler için gerektiğinde teknik İngilizce terimler kullanılabilir ancak genel iletişim dili Türkçedir.

## General Guidelines

1. **Maintain Structure:**

   - Do not modify the primary structure of any files.
   - Avoid refactoring or reorganizing code unless explicitly requested.

2. **Comment Your Changes:**

   - Add comments for every change made.
   - Use clear, concise comments explaining the purpose of the change.

3. **Focus Area:**

   - Operate within the file and project structure provided.
   - Do not introduce new dependencies without explicit instructions.

4. **Adhere to Standards:**
   - Follow TypeScript best practices.
   - Ensure compliance with ESLint rules and project-specific configurations.

## Allowed Operations

- Implement requested functionality while keeping the code structure intact.
- Fix bugs and issues without altering unrelated sections of the code.
- Write utility functions or helpers only if necessary and requested.

## Prohibited Actions

- Avoid introducing breaking changes to the existing code.
- Do not modify unrelated parts of the codebase.
- Do not change the overall formatting or coding style unless requested.

## Comments and Documentation

- **Inline Comments:** Use comments to document logic changes.
  ```typescript
  
  ```
- **Change Explanation:** Briefly explain any additions or updates made to the code.

## Example Usage:

### Before

```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

### After

```typescript
function add(a: number, b: number): number {
  
  return a + b;
}
```

## Scope of Work

- Files in similar structure as this repository.
- Typescript-based projects, ensuring compatibility and clean implementation.

## Project-Specific Rules

1. Maintain all file imports and exports as originally provided.
2. Use TypeScript-specific constructs where applicable.
   - Example: Replace `any` with explicit types.

## Testing and Verification

- Ensure all changes pass the existing unit tests.
- If new functions are added, provide minimal test coverage in the existing testing framework.

## Summary

Follow these rules strictly to ensure Copilot’s contributions align with the project’s requirements and maintain code integrity.
