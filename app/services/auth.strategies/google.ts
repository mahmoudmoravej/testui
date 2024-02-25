import {
  GetLoggedInUserInfoDocument,
  GetLoggedInUserInfoQuery,
} from "@app-types/graphql";

import { AuthorizationError } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import type { User } from "~/models/user";
import { getApolloClient } from "~/utils";
import cookie from "cookie";

export let googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    callbackURL: "/auth/google/callback",
  },
  async ({
    accessToken,
    refreshToken,
    extraParams,
    profile,
    request,
    context,
  }) => {
    // Get the user data from your DB or API using the tokens and profile
    const jwt_token = extraParams.id_token;

    const cookieString = request.headers.get("cookie") ?? "";
    const organization_id = cookie.parse(cookieString).auth_organization_id; //we should not use this temporary cookie anywhere else

    try {
      const client = getApolloClient(
        process.env.GRAPHQL_SCHEMA_URL,
        jwt_token,
        organization_id,
      );
      const result = await client.query<GetLoggedInUserInfoQuery>({
        query: GetLoggedInUserInfoDocument,
        fetchPolicy: "network-only",
      });

      const myInfo = result.data?.myInfo;
      if (
        myInfo === undefined ||
        result.error ||
        result.errors ||
        myInfo.Individual == null
      )
        throw new Error("No user info found");

      const individual = myInfo.Individual;

      return {
        email: profile.emails[0].value,
        jwt_token: jwt_token,
        name: profile.displayName,
        individual_id: individual.id,
        user_id: myInfo.UserId,
        is_manager: individual.isManager,
        organization_id: individual.organizationId,
      } as User;
    } catch (error: any) {
      const msg =
        "Error fetching loggined in user info through API. Details: " +
        JSON.stringify({ url: process.env.GRAPHQL_SCHEMA_URL, error: error });
      console.error(msg);
      throw new AuthorizationError(msg);
    }
  },
);
