/**
 * pass an array of users with usernames and passwords, any additional data included in the subobjects will be passed in as well as the identity parameter into your endpoint
 * @param {[{ username: string, password: string }]} users
 */
export function makeHardcodedBasicAuthenticator(users: [{
    username: string;
    password: string;
}]): ({ headers }: {
    headers: any;
}) => Promise<any>;
export function makeBasicAuthenticator(getUserFromCredentialsFunction: any): ({ headers }: {
    headers: any;
}) => Promise<any>;
