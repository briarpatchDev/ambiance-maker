//Returns a random string, used for creating passwords, sessions, or anything else like that
export function randomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890123456789__";
  let result = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += characters.charAt(array[i] % characters.length);
  }
  return result;
}
