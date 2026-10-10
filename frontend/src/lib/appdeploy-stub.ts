/**
 * Local development stub for @appdeploy/client.
 *
 * @appdeploy/client is injected by the AppDeploy platform at runtime and is
 * not available when running locally with `npm run dev`. This stub exports the
 * same shape so Vite can resolve the import without crashing.
 *
 * All functions throw a clear error if called, so you know immediately that
 * auth/API requires a real AppDeploy deployment to work end-to-end.
 */

const platformError = () => {
  throw new Error(
    '[GenZ Bank] @appdeploy/client is not available in local dev mode.\n' +
    'Auth and API calls only work when deployed on the AppDeploy platform.'
  );
};

export const auth = {
  getUser:  () => Promise.resolve(null),
  signIn:   platformError,
  signOut:  platformError,
};

export const api = {
  get:  platformError,
  post: platformError,
  put:  platformError,
};
