# 1. Prisma Client Initialization (lib/prisma.ts)
```typescript
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
```

# 2. Server-Side Data Fetching Hook (hooks/usePrismaQuery.ts)
```typescript
"use client";

import { 
  QueryFunction, 
  QueryKey, 
  useQuery, 
  UseQueryOptions 
} from "@tanstack/react-query";

// Custom hook to wrap Prisma queries with React Query
export function usePrismaQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn,
    ...options
  });
}
```

# 3. Server Action for Data Fetching (actions/userActions.ts)
```typescript
"use server"

import { prisma } from "@/lib/prisma"

export async function getUsersWithPosts() {
  return prisma.user.findMany({
    include: { 
      posts: true 
    }
  });
}

export async function createUser(data: { 
  name: string, 
  email: string 
}) {
  return prisma.user.create({ 
    data 
  });
}
```

# 4. Client Component with Prisma and React Query (components/UserList.tsx)
```typescript
"use client";

import { useState } from 'react';
import { usePrismaQuery } from '@/hooks/usePrismaQuery';
import { getUsersWithPosts, createUser } from '@/actions/userActions';
import { 
  useMutation, 
  useQueryClient 
} from '@tanstack/react-query';

export function UserList() {
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '' 
  });

  // Query to fetch users
  const { data: users, isLoading, error } = usePrismaQuery(
    ['users'], 
    getUsersWithPosts,
    {
      // Optional: specify stale time and initial data
      staleTime: 1000 * 60 * 5, // 5 minutes
      placeholderData: []
    }
  );

  // Query client for mutations
  const queryClient = useQueryClient();

  // Mutation to create user
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ 
        queryKey: ['users'] 
      });
      
      // Reset form
      setNewUser({ name: '', email: '' });
    },
    onError: (error) => {
      console.error('User creation failed', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(newUser);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* User Creation Form */}
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser(prev => ({
            ...prev, 
            name: e.target.value 
          }))}
          required
        />
        <input 
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser(prev => ({
            ...prev, 
            email: e.target.value 
          }))}
          required
        />
        <button type="submit">
          {createUserMutation.isPending ? 'Creating...' : 'Create User'}
        </button>
      </form>

      {/* User List */}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} (Posts: {user.posts.length})
          </li>
        ))}
      </ul>
    </div>
  );
}
```

# 5. Providers Setup (providers/QueryProvider.tsx)
```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Adjust as needed
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

# 6. Layout Integration (app/layout.tsx)
```typescript
import { QueryProvider } from "@/providers/QueryProvider";

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

# 7. Dependencies to Install
```bash
npm install @prisma/client @tanstack/react-query @tanstack/react-query-devtools
npm install -D prisma
```

### Key Integration Points

1. **Prisma Client Singleton**
   - Ensures a single Prisma instance across server-side rendering
   - Prevents multiple database connection issues

2. **Custom React Query Hook**
   - `usePrismaQuery`: Wraps Prisma queries with React Query
   - Provides type safety and consistent querying
   - Allows custom configuration like stale time and placeholder data

3. **Server Actions**
   - Separate data fetching and mutation logic
   - Work seamlessly with both Prisma and React Query
   - Enable type-safe server-side operations

4. **Client Component Integration**
   - Use `usePrismaQuery` for data fetching
   - Leverage `useMutation` for data modifications
   - Automatic cache invalidation and refetching

### Setup and Installation

```bash
# Install dependencies
npm install @prisma/client @tanstack/react-query @tanstack/react-query-devtools
npm install -D prisma

# Initialize Prisma
npx prisma init

# Generate Prisma Client
npx prisma generate

# Create database migrations
npx prisma migrate dev
```

### Best Practices
- Use server actions for data mutations
- Leverage React Query's caching and invalidation
- Handle loading and error states
- Use TypeScript for type safety
- Configure query client options globally

### Considerations
- Adjust stale time based on your data update frequency
- Implement proper error handling
- Use query invalidation for real-time data updates