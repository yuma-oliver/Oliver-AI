// Universal stub for Node.js built-in modules (not available in browser)
// Uses a Proxy so any named import resolves to undefined without error
const handler: ProxyHandler<Record<string, unknown>> = {
  get: (_target, _prop) => undefined,
};
export default new Proxy({}, handler);
// Re-export common names as undefined to satisfy named import patterns
export const randomUUID = undefined;
export const promisify = undefined;
export const execFile = undefined;
export const Readable = undefined;
export const pipeline = undefined;
export const resolve = undefined;
export const join = undefined;
export const dirname = undefined;
export const sep = undefined;
export const readFile = undefined;
export const writeFile = undefined;
export const mkdir = undefined;
export const stat = undefined;
export const rm = undefined;
export const homedir = undefined;
export const tmpdir = undefined;
