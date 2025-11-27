# Development Guide

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the root directory with your Firebase configuration.

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Testing

We use Vitest and React Testing Library for testing.

-   **Run Unit Tests**
    ```bash
    npx vitest run
    ```

-   **Run Tests in Watch Mode**
    ```bash
    npx vitest
    ```

## Project Structure

-   `components/`: Reusable UI components
-   `pages/`: Application pages
-   `services/`: Firebase service interactions
-   `types/`: TypeScript definitions
-   `scripts/`: Utility scripts (seeding, etc.)
-   `__tests__/`: Unit and integration tests

## Key Workflows

-   **Adding a new feature**:
    1.  Define types in `types.ts`
    2.  Create service functions in `services/`
    3.  Create components in `components/`
    4.  Add page in `pages/`
    5.  Add route in `App.tsx`
