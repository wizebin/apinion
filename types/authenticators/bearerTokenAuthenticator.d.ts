export function makeBearerTokenAuthenticator(getUserFromBearerFunction: any): ({ headers }: {
    headers: any;
}) => Promise<any>;
