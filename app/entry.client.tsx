/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ThemeProvider } from "@material-tailwind/react";

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

const process = {
  env: {
    GRAPHQL_SCHEMA_URL: "http://localhost:3000/graphql",
  },
};

startTransition(() => {
  const client = new ApolloClient({
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
    uri: process.env.GRAPHQL_SCHEMA_URL || "GRAPHQL_SCHEMA_URL IS NOT SET", // the same uri in our entry.server file
  });

  hydrateRoot(
    document,
    <StrictMode>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <RemixBrowser />
        </ThemeProvider>
      </ApolloProvider>
    </StrictMode>,
  );
});
