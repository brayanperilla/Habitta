# Application Stores

This directory is reserved for future state management implementation.

## Planned Implementation

When the application grows, we may implement global state management using:

- React Context API
- Zustand
- Redux Toolkit
- Or another state management solution

## Current Approach

For now, state is managed using:

- React hooks (`useState`, `useEffect`)
- Custom hooks in `../hooks/`
- Services in `../services/`

## Future Stores

Potential stores to implement:

- `propertyStore.ts` - Global property state and caching
- `authStore.ts` - Global authentication state
- `favoriteStore.ts` - User favorites management
- `notificationStore.ts` - Notifications state
