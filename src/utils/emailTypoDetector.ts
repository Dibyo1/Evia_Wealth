/**
 * Email Domain Typo Detector & Suggestion Engine for Evia Wealth
 *
 * NOTE: This is purely a client-side UX assistance layer.
 * It does NOT authenticate users, modify inputs automatically, or bypass validation.
 */

// Common domains to check against (extensible)
export const COMMON_EMAIL_DOMAINS: readonly string[] = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "rediffmail.com",
  "live.com",
  "aol.com",
  "zoho.com",
  "me.com",
  "mac.com",
  "msn.com",
];

// Common TLD typos
const TLD_MAPPINGS: Record<string, string> = {
  con: "com",
  cmo: "com",
  ocm: "com",
  comm: "com",
  co: "com", // for major US consumer hosts (e.g. gmail.co -> gmail.com)
  ney: "net",
  ogr: "org",
};

/**
 * Calculates Damerau-Levenshtein distance between two strings,
 * which accounts for insertions, deletions, substitutions, and adjacent transpositions.
 */
export function damerauLevenshteinDistance(source: string, target: string): number {
  const src = source.toLowerCase();
  const tgt = target.toLowerCase();
  const srcLen = src.length;
  const tgtLen = tgt.length;

  if (srcLen === 0) return tgtLen;
  if (tgtLen === 0) return srcLen;

  // Initialize distance matrix
  const matrix: number[][] = Array.from({ length: srcLen + 1 }, () =>
    new Array<number>(tgtLen + 1).fill(0)
  );

  for (let i = 0; i <= srcLen; i++) matrix[i][0] = i;
  for (let j = 0; j <= tgtLen; j++) matrix[0][j] = j;

  for (let i = 1; i <= srcLen; i++) {
    for (let j = 1; j <= tgtLen; j++) {
      const cost = src[i - 1] === tgt[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );

      // Transposition check (e.g. 'gamil' vs 'gmail')
      if (
        i > 1 &&
        j > 1 &&
        src[i - 1] === tgt[j - 2] &&
        src[i - 2] === tgt[j - 1]
      ) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1);
      }
    }
  }

  return matrix[srcLen][tgtLen];
}

/**
 * Analyzes an entered email address and returns a suggested correction if
 * a high-confidence domain typo is detected.
 *
 * @param email - The email string typed by the user
 * @param customDomains - Optional additional domain whitelist to check
 * @returns Corrected email string (e.g. "user@gmail.com") or null if no typo detected
 */
export function suggestEmailCorrection(
  email: string,
  customDomains: readonly string[] = COMMON_EMAIL_DOMAINS
): string | null {
  if (!email || typeof email !== "string") return null;

  const trimmed = email.trim().toLowerCase();

  // Must have exactly one @ separator
  const atParts = trimmed.split("@");
  if (atParts.length !== 2) return null;

  const [localPart, domainPart] = atParts;

  // Local part must be non-empty and domain must have enough characters to evaluate
  if (!localPart || !domainPart) return null;

  // Incomplete states (e.g. user is still typing "@g", "@gm") - do not prematurely suggest
  if (domainPart.length < 4) return null;

  // Exact match to any known domain -> No typo!
  if (customDomains.includes(domainPart)) return null;

  // 1. Check for simple TLD typos (e.g., "gmail.con" -> "gmail.com")
  const domainSegments = domainPart.split(".");
  if (domainSegments.length === 2) {
    const [sub, tld] = domainSegments;
    if (TLD_MAPPINGS[tld]) {
      const candidateDomain = `${sub}.${TLD_MAPPINGS[tld]}`;
      if (customDomains.includes(candidateDomain)) {
        return `${localPart}@${candidateDomain}`;
      }
    }
  }

  // 2. Similarity search across common domains
  let closestDomain: string | null = null;
  let minDistance = Infinity;

  for (const commonDomain of customDomains) {
    const dist = damerauLevenshteinDistance(domainPart, commonDomain);

    // Dynamic threshold based on length of the domain:
    // For short domains like "proton.me" (9 chars) or "gmail.com" (9 chars):
    // Max distance allowed is 2 (e.g. "gmial.com" -> dist 1, "gamil.con" -> dist 2).
    // For arbitrary business domains (e.g. "eviawealth.com" -> dist 8 to gmail),
    // distance is way too high and safely ignored.
    const maxAllowedDist = commonDomain.length > 10 ? 3 : 2;

    if (dist > 0 && dist <= maxAllowedDist && dist < minDistance) {
      // Calculate normalized similarity score (0 to 1)
      const maxLen = Math.max(domainPart.length, commonDomain.length);
      const similarity = 1 - dist / maxLen;

      // Only accept if similarity is at least 70%
      if (similarity >= 0.7) {
        minDistance = dist;
        closestDomain = commonDomain;
      }
    }
  }

  if (closestDomain) {
    return `${localPart}@${closestDomain}`;
  }

  // 3. User typed domain name without TLD yet (e.g. "user@gmail", "user@yahoo", "user@outlook")
  // if domain has no dot and length >= 5
  if (!domainPart.includes(".")) {
    for (const commonDomain of customDomains) {
      const [namePart] = commonDomain.split(".");
      if (domainPart === namePart || damerauLevenshteinDistance(domainPart, namePart) <= 1) {
        return `${localPart}@${commonDomain}`;
      }
    }
  }

  return null;
}
