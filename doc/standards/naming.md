## Naming

### Why

- Code consistency

### Key points

- **No reference to variable type with TypeScript's enums, interfaces and types:**
  - ✅ Good: no reference to type in name
    ```tsx
    export enum Colors {
        ACCENT = '#0066ff',
        ATTENTION = '#ffea00',
    //  ...
    }
    ```
  - ❌ Bad:
    ```tsx
    export enum ColorsEnum {
        ACCENT = '#0066ff',
        ATTENTION = '#ffea00',
    //  ...
    }
    ```

### Mistakes to avoid when following the standard

### Resources
