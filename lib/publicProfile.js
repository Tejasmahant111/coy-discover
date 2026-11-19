/**
 * The ONLY shape of a profile that may leave the server.
 *
 * This is an allow-list on purpose: if someone later adds a private field to a
 * profile (e.g. `likesYou`, a phone number, a score), it stays private by
 * default instead of leaking until someone remembers to delete it.
 */
export const PUBLIC_PROFILE_FIELDS = Object.freeze([
  'id',
  'name',
  'age',
  'photo',
  'bio',
  'city',
  'college',
  'interests',
]);

export function toPublicProfile(profile) {
  const out = {};
  for (const key of PUBLIC_PROFILE_FIELDS) {
    if (profile[key] !== undefined) {
      out[key] = Array.isArray(profile[key]) ? [...profile[key]] : profile[key];
    }
  }
  return out;
}
