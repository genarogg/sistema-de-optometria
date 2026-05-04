'use client'
import { URL_BACKEND } from '@/env'

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

export const client = new ApolloClient({
link: new HttpLink({ uri: URL_BACKEND + '/graphql', }),
  cache: new InMemoryCache(),
})

export default function ApolloClientProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}