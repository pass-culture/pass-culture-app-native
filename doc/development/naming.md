## Naming

### Why

- Code consistency

### Key points

- **No reference to variable type with TypeScript's enums, interfaces and types:**
  
  ✅ Good: no reference to type in name
    ```tsx
    export enum BookingsTab {
        CURRENT = 'En cours',
        COMPLETED = 'Terminées',
    //  ...
    }
    ```
  
  ❌ Bad:
    ```tsx
    export enum BookingsTabEnum {
        CURRENT = 'En cours',
        COMPLETED = 'Terminées',
    //  ...
    }
    ```
