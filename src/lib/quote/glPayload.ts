// General Liability (ACORD 125 / 126 / 140) payload helpers for the quote form. Pure functions, no React.
// Add-only: every legacy field name the form already posts is left untouched; the canonical names the
// map_quote_125.py mapper reads are posted ALONGSIDE them. Nothing here writes a policy number, a typed
// signature or a signed date, and a yn_* answer that is not exactly Yes/No is stored blank (never "No").
import {
  YN_QUESTIONS, GENERAL_DETAILS, QUESTIONS_WITH_EXPLAIN, EXPLAIN_MAX, EXPLAIN_DEFAULT_MAX, TERMINATION_REASONS,
  detailName, sanitizeYn, oneYearAfter,
} from "./quoteSpec";

type Flat = Record<string, string>;

export const GL_TRIGGER_COVERAGE = "General liability";
export const WC_COVERAGE = "Workers compensation";

export const STATE_CODE: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE",
  "District of Columbia": "DC", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA",
  Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN",
  Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR",
  Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT",
  Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
};

// Names the WC section already renders. When both lines are picked the GL section does NOT render these a
// second time (one control per name, so neither section can overwrite the other's answer).
export const SHARED_WITH_WC = new Set<string>([
  "dba", "entityType", "fein", "sicCode", "naicsCode", "physicalCounty", "desiredExpirationDate", "desiredEffectiveDate",
  "usesSubcontractors", "ynExplain_usesSubcontractors",
  "yn_athleticTeams", "ynExplain_athleticTeams",
  "lossesLast3Years", "lossCount", "lossDate", "lossLineOfBusiness", "lossDescription", "lossAmountPaid", "lossAmountReserved",
  "lossHistoryStatus", "lossAdditional",
]);

export const hasCoverage = (coverageTypes: string, c: string) => (coverageTypes || "").split(", ").includes(c);

const money = (v: string) => (v || "").replace(/[$,\s]/g, "");
const listOf = (v: string | undefined) => (v ? v.split(", ").filter(Boolean) : []);

/**
 * Drops answers whose parent answer no longer asks for them (a visitor who flips Yes -> No must not post the
 * stale follow-up) and blanks any yn_* that is not exactly Yes/No. `shared` = the WC section's values when WC is
 * also picked (its yn_athleticTeams / usesSubcontractors answers drive the GL follow-ups).
 */
export function cleanGl(gl: Flat, shared: Flat = {}): Flat {
  const all: Flat = { ...shared, ...gl };
  const out: Flat = {};
  const ans = (k: string) => all[k] || "";
  const yes = (q: string) => ans(`yn_${q}`) === "Yes";
  for (const [k, v] of Object.entries(gl)) {
    if (v === "" || v == null) continue;
    let keep = true;
    if (k.startsWith("ynExplain_")) keep = ans(`yn_${k.slice(10)}`) === "Yes";
    else if (k.startsWith("general_")) {
      const q = k.slice(8).split("__")[0];
      keep = yes(q);
      if (q === "coverageTerminated" && keep && k.endsWith("conditionCorrectedDescription")) keep = ans("general_coverageTerminated__conditionCorrected") === "Yes";
    }
    else if (k === "subsCarryInsurance" || k === "workSubcontractedDescription") keep = ans("usesSubcontractors") === "Yes";
    else if (k === "safetyProgramElements") keep = yes("safetyProgramsExist");
    else if (k === "safetyOtherText") keep = yes("safetyProgramsExist") && listOf(ans("safetyProgramElements")).includes("Other");
    else if (k.startsWith("athletic") && k !== "athleticTeams") keep = yes("athleticTeams");
    else if (k === "poolConstruction" || k === "poolSafetyFeatures") keep = yes("swimmingPool");
    else if (k === "rentEquipmentTypes" || k === "rentEquipmentInstructionGiven") keep = yes("rentOrLoanEquipment");
    else if (k === "leaseEmployeesWorkersCompCarried") keep = yes("leaseEmployees");
    else if (k.startsWith("loss") && ["lossCount", "lossLineOfBusiness", "lossDate", "lossDescription", "lossHistoryStatus", "lossAmountPaid", "lossAmountReserved", "lossSubrogation", "lossAdditional"].includes(k)) keep = ans("lossesLast3Years") === "Yes";
    if (keep) out[k] = v;
  }
  // coverageTerminated = Yes: the four reason boxes are tick-boxes, an unticked one is a real "No" (spec rule).
  if (yes("coverageTerminated")) {
    for (const r of TERMINATION_REASONS) { const n = `general_coverageTerminated__${r.key}`; if (!out[n]) out[n] = "No"; }
  }
  return sanitizeYn(out);
}

/** Checkbox groups the browser cannot mark required. Returns a visitor-facing message or "". */
export function glErrors(gl: Flat, shared: Flat = {}): string {
  const all: Flat = { ...shared, ...gl };
  const yes = (q: string) => all[`yn_${q}`] === "Yes";
  if (yes("coverageTerminated") && !TERMINATION_REASONS.some((r) => all[`general_coverageTerminated__${r.key}`] === "Yes"))
    return "Please tick at least one reason the coverage was terminated.";
  if (yes("safetyProgramsExist") && !listOf(all.safetyProgramElements).length) return "Please pick at least one safety program element.";
  if (yes("swimmingPool") && !listOf(all.poolSafetyFeatures).length) return "Please pick at least one pool safety feature.";
  if (yes("rentOrLoanEquipment") && !listOf(all.rentEquipmentTypes).length) return "Please pick the type of equipment rented or loaned.";
  return "";
}

/**
 * The canonical (mapper) names derived from the legacy fields the form already collects. Only fills a name
 * that is still empty; never overwrites a value the visitor typed under the canonical name.
 */
export function mirrorLegacyToCanonical(fd: Flat, glOut: Flat, wc: Flat = {}): Flat {
  const o: Flat = {};
  const have = (k: string) => !!(glOut[k] || wc[k] || fd[k] || o[k]);
  const put = (to: string, v: string | undefined) => { if (!have(to) && v) o[to] = v; };
  const code = STATE_CODE[fd.state] || (fd.state && fd.state.length === 2 ? fd.state.toUpperCase() : "");
  // The legacy "business address" is the physical premises (mailing = same unless the WC block says otherwise).
  put("physicalAddress", fd.address); put("physicalCity", fd.city); put("physicalState", code); put("physicalZip", fd.zip);
  put("businessDescription", fd.business_description);
  put("yearBusinessStarted", fd.year_business_started);
  put("lastGrossSales", money(fd.priorGrossSales));
  put("lastSubcontractingCosts", money(fd.priorSubcontractorExpenses).slice(0, 16));
  put("lastEmployeeCount", fd.priorEmployeeCount); put("lastEmployeePayroll", money(fd.priorEmployeePayroll));
  put("currentCarrier", fd.prior_carrier_name); put("currentPolicyExpiration", fd.prior_policy_expiration);
  put("coverageTypes", fd.coverage_types);
  if (!glOut.subsCarryInsurance && !wc.subsCarryInsurance && (glOut.usesSubcontractors || wc.usesSubcontractors) === "Yes") {
    // legacy select "Do your subcontractors have insurance?" (Yes - all of them / Some / No / We don't use subs)
    const s = fd.subsHaveInsurance || "";
    if (/^yes/i.test(s)) o.subsCarryInsurance = "Yes"; else if (/^no$/i.test(s) || /^some/i.test(s)) o.subsCarryInsurance = "No";
  }
  return o;
}

/**
 * Everything the GL block adds to the lead payload. `gl` = the GlSection state, `wc` = the WcSection state (or {}).
 * Legacy names in `fd` are posted by the caller unchanged.
 */
export function buildGlExtra(fd: Flat, gl: Flat, wc: Flat = {}): Flat {
  const clean = cleanGl(gl, wc);
  const mirrored = mirrorLegacyToCanonical(fd, clean, wc);
  const out: Flat = { ...mirrored, ...clean };
  // Policy end date defaults to 12 months after the start date (the shared form + route do the same).
  const eff = out.desiredEffectiveDate || wc.coverageStart || wc.desiredEffectiveDate || "";
  if (!out.desiredExpirationDate && !wc.desiredExpirationDate && eff) out.desiredExpirationDate = oneYearAfter(eff);
  return out;
}

export { YN_QUESTIONS, GENERAL_DETAILS, QUESTIONS_WITH_EXPLAIN, EXPLAIN_MAX, EXPLAIN_DEFAULT_MAX, TERMINATION_REASONS, detailName };
