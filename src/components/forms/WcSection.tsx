"use client";

import { useEffect, useState } from "react";
import { OwnersFieldset } from "@/components/forms/OwnersFieldset";

// ACORD 130 (workers compensation) intake. Mounted ONLY while "Workers compensation" is ticked in
// coverage_types. Field names are the ghostworkerscompinsurance.com / map_acord130.py names; every
// one is declared in public/__forms.html. No signature or signed date is collected here.
// Reports every value upward through onChange; the parent merges them into the lead payload.

const STATE_ABBR = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
const ENTITY_TYPES = ["Sole proprietor", "Partnership", "LLC", "Corporation", "S-Corporation", "Joint venture", "Other"];
const EL_LIMITS = ["100,000", "500,000", "1,000,000"];
const CLASS_ROWS = [1, 2, 3, 4, 5];
const PRIOR_ROWS = [2, 3, 4, 5];

// [key, label, hasExplainBox]; posted as yn_<key> (Yes / No) and ynExplain_<key>. Blank is never No.
const WC_YN: [string, string, boolean][] = [
  ["foreignCoverage", "Do you need Foreign coverage?", false],
  ["voluntaryComp", "Do you want Voluntary Compensation coverage?", false],
  ["uslh", "Do you need U.S. Longshore and Harbor Workers (USL&H) coverage?", false],
  ["aircraftWatercraft", "Do you own, operate or lease aircraft or watercraft?", true],
  ["hazardousMaterial", "Do past, present or discontinued operations involve storing, treating, discharging, applying, disposing of or transporting hazardous material?", true],
  ["undergroundOrHeights", "Is any work performed underground or above 15 feet?", true],
  ["overWaterWork", "Is any work performed on barges, vessels, docks or bridges over water?", true],
  ["otherBusiness", "Are you engaged in any other type of business?", true],
  ["subletWithoutCOI", "Is any work sublet without certificates of insurance?", true],
  ["safetyProgram", "Is a written safety program in operation?", true],
  ["groupTransportation", "Is any group transportation provided?", true],
  ["minorsOrSeniors", "Any employees under 16 or over 60 years of age?", true],
  ["seasonalEmployees", "Any seasonal employees?", true],
  ["volunteerLabor", "Is there any volunteer or donated labor?", true],
  ["physicalHandicaps", "Any employees with physical handicaps?", true],
  ["outOfStateTravel", "Do employees travel out of state?", true],
  ["athleticTeams", "Are athletic teams sponsored?", true],
  ["physicalsRequired", "Are physicals required after offers of employment are made?", true],
  ["otherInsuranceWithCarrier", "Any other insurance with this company?", true],
  ["employeeHealthPlan", "Is an employee health plan provided?", true],
  ["employeesOtherBusinesses", "Do any employees perform work for other businesses or subsidiaries?", true],
  ["leasedEmployees", "Do you lease employees to or from other employers?", true],
  ["workFromHome", "Do employees predominantly work from home?", true],
  ["taxLiensBankruptcy", "Any tax liens or bankruptcy within the last five years?", true],
  ["unpaidWCPremium", "Any undisputed and unpaid workers compensation premium due from you or any commonly owned or managed business?", true],
];

interface Props {
  inputClass: string;
  labelClass: string;
  onChange: (fields: Record<string, string>) => void;
}

export function WcSection({ inputClass, labelClass, onChange }: Props) {
  const [v, setV] = useState<Record<string, string>>({ mailingSameAsPhysical: "Yes" });
  const [owners, setOwners] = useState<Record<string, string>>({});
  const set = (k: string, val: string) => setV((p) => ({ ...p, [k]: val }));
  const g = (k: string) => v[k] || "";

  useEffect(() => {
    onChange({ ...v, ...owners });
  }, [v, owners, onChange]);

  // Plain functions (not components) so inputs keep focus while typing.
  const txt = (name: string, label: string, o: { req?: boolean; type?: string; ph?: string; max?: number; mode?: "numeric" | "decimal" } = {}) => (
    <div key={name}>
      <label htmlFor={`wc-${name}`} className={labelClass}>{label}{o.req ? " *" : ""}</label>
      <input id={`wc-${name}`} name={name} type={o.type || "text"} required={o.req} maxLength={o.max} inputMode={o.mode} placeholder={o.ph} value={g(name)} onChange={(e) => set(name, e.target.value)} className={inputClass} />
    </div>
  );
  const area = (name: string, label: string, req = false) => (
    <div key={name}>
      <label htmlFor={`wc-${name}`} className={labelClass}>{label}</label>
      <textarea id={`wc-${name}`} name={name} rows={3} required={req} value={g(name)} onChange={(e) => set(name, e.target.value)} className={`${inputClass} resize-none`} />
    </div>
  );
  const sel = (name: string, label: string, opts: string[], req = false) => (
    <div key={name}>
      <label htmlFor={`wc-${name}`} className={labelClass}>{label}{req ? " *" : ""}</label>
      <select id={`wc-${name}`} name={name} required={req} value={g(name)} onChange={(e) => set(name, e.target.value)} className={inputClass}>
        <option value="">Select…</option>
        {opts.map((o) => (<option key={o} value={o}>{o}</option>))}
      </select>
    </div>
  );
  const ynRow = (name: string, label: string, req = false) => (
    <fieldset key={name} className="space-y-1.5">
      <legend className={labelClass}>{label}{req ? " *" : ""}</legend>
      <div className="flex gap-6">
        {["Yes", "No"].map((o) => (
          <label key={o} className="inline-flex items-center gap-2 text-sm text-espresso">
            <input type="radio" name={name} value={o} required={req} checked={g(name) === o} onChange={() => set(name, o)} /> {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
  const head = (title: string, note: string) => (
    <div className="pt-5 border-t border-adobe">
      <h3 className="font-heading font-bold text-espresso text-sm uppercase tracking-wider">{title}</h3>
      <p className="text-xs text-mocha/70 mt-0.5">{note}</p>
    </div>
  );
  const two = (...kids: React.ReactNode[]) => <div className="grid sm:grid-cols-2 gap-4">{kids}</div>;

  return (
    <div className="space-y-5" data-wc-section>
      {head("Workers' compensation details", "Because you picked Workers compensation. Best estimates are fine.")}
      {two(txt("dba", "Doing business as (DBA)"), sel("entityType", "Business structure", ENTITY_TYPES, true))}
      {g("entityType") === "Other" && txt("entityTypeOther", "Describe the business structure")}
      {two(txt("fein", "FEIN (optional, leave blank for a new venture)", { ph: "12-3456789" }), txt("experienceMod", "Experience modification factor (if any)", { ph: "e.g. 0.85" }))}
      {two(txt("businessWebsite", "Business website", { type: "url", ph: "https://" }), txt("secondaryPhone", "Secondary phone", { type: "tel" }))}
      {two(txt("sicCode", "SIC code (if known)", { mode: "numeric" }), txt("naicsCode", "NAICS code (if known)", { mode: "numeric" }))}
      {two(txt("ncciRiskId", "NCCI risk ID (if known)"), txt("physicalCounty", "County of the business address"))}
      {two(txt("coverageStart", "Desired coverage start date", { type: "date" }), txt("desiredExpirationDate", "Desired expiration date (optional, we default to 12 months)", { type: "date" }))}

      {head("Mailing address", "Only if it differs from the business address above.")}
      {ynRow("mailingSameAsPhysical", "Is the mailing address the same as the business address?")}
      {g("mailingSameAsPhysical") === "No" && (
        <>
          {txt("mailingAddress", "Mailing street address")}
          {two(txt("mailingCity", "Mailing city"), sel("mailingState", "Mailing state", STATE_ABBR))}
          {txt("mailingZip", "Mailing ZIP", { mode: "numeric" })}
        </>
      )}

      {head("Contacts", "Who our underwriters should call.")}
      {two(txt("inspectionContactName", "Inspection contact name"), txt("inspectionContactPhone", "Inspection contact phone", { type: "tel" }))}
      {two(txt("accountingContactName", "Accounting / audit contact name"), txt("accountingContactPhone", "Accounting contact phone", { type: "tel" }))}
      {two(txt("claimContactName", "Claims contact name"), txt("claimContactPhone", "Claims contact phone", { type: "tel" }))}

      {head("Payroll by class of work", "Row 1 is required. Add more rows for each other kind of work you do.")}
      {CLASS_ROWS.map((n) => (
        <div key={n} className="space-y-3 rounded-xl border border-adobe p-4">
          <p className="text-sm font-semibold text-mocha">Class {n}{n === 1 ? " (required)" : " (optional)"}</p>
          {two(txt(`classCode${n}`, "Class code", { req: n === 1, ph: "e.g. 0042" }), txt(`classPayroll${n}`, "Annual payroll ($)", { req: n === 1, mode: "numeric" }))}
          {txt(`classDuties${n}`, "Duties", { req: n === 1, max: 42, ph: "Short description of the work" })}
          {two(txt(`classFullTime${n}`, "Full-time employees", { req: n === 1, mode: "numeric" }), txt(`classPartTime${n}`, "Part-time employees", { req: n === 1, mode: "numeric" }))}
        </div>
      ))}
      {two(txt("numberOfEmployees", "Total employees", { mode: "numeric" }), txt("amountOfPayroll", "Total annual payroll ($)", { mode: "numeric" }))}

      {head("Owners and officers", "Up to 4 owners or officers. Row 1 is required; leave an owner Excluded if they opt out of coverage.")}
      <OwnersFieldset inputClass={inputClass} labelClass={labelClass} buttonClass="btn-secondary min-h-[44px]" accentTextClass="text-clay" mutedTextClass="text-mocha" borderClass="border-adobe" onFieldsChange={setOwners} />

      {head("Employers liability limits", "Optional.")}
      {two(sel("elEachAccident", "Each accident", EL_LIMITS), sel("elDiseasePolicy", "Disease, policy limit", EL_LIMITS))}
      {sel("elDiseaseEachEmployee", "Disease, each employee", EL_LIMITS)}

      {head("Current coverage and claims", "Policy year 1 is your current or most recent policy. Enter 0 if there were no claims.")}
      {two(txt("priorPremium", "Annual premium, current or most recent policy ($)", { mode: "numeric" }), txt("priorYear1Year", "Policy year", { max: 4, mode: "numeric", ph: "2025" }))}
      {two(txt("priorYear1ClaimCount", "Number of claims", { req: true, mode: "numeric", ph: "0" }), txt("priorYear1Paid", "Amount paid ($)", { req: true, mode: "numeric", ph: "0" }))}
      {txt("priorYear1Reserved", "Amount reserved ($)", { req: true, mode: "numeric", ph: "0" })}
      <details>
        <summary className="cursor-pointer text-sm font-heading font-bold text-espresso uppercase tracking-wider">Prior years 2 to 5 (optional)</summary>
        <div className="space-y-4 mt-3">
          {PRIOR_ROWS.map((n) => (
            <div key={n} className="space-y-3 rounded-xl border border-adobe p-4">
              <p className="text-sm font-semibold text-mocha">Policy year {n}</p>
              {two(txt(`priorYear${n}Year`, "Policy year", { max: 4, mode: "numeric" }), txt(`priorYear${n}Carrier`, "Carrier name"))}
              {two(txt(`priorYear${n}Premium`, "Premium ($)", { mode: "numeric" }), txt(`priorYear${n}Mod`, "Experience mod"))}
              {two(txt(`priorYear${n}ClaimCount`, "Number of claims", { mode: "numeric" }), txt(`priorYear${n}Paid`, "Amount paid ($)", { mode: "numeric" }))}
              {txt(`priorYear${n}Reserved`, "Amount reserved ($)", { mode: "numeric" })}
            </div>
          ))}
        </div>
      </details>

      {head("Loss history", "Claims in the last 3 years. No claimant names or medical details.")}
      {ynRow("lossesLast3Years", "Any workers comp losses or claims in the last 3 years?")}
      {g("lossesLast3Years") === "Yes" && (
        <>
          {two(txt("lossCount", "Number of claims", { mode: "numeric" }), txt("lossDate", "Date of the most recent loss", { type: "date" }))}
          {txt("lossLineOfBusiness", "Line of business", { ph: "Workers compensation" })}
          {area("lossDescription", "Brief description of what happened")}
          {two(txt("lossAmountPaid", "Amount paid ($)", { mode: "numeric" }), txt("lossAmountReserved", "Amount reserved ($)", { mode: "numeric" }))}
          {sel("lossHistoryStatus", "Claim status", ["Open", "Closed"])}
          {area("lossAdditional", "Anything else about your loss history")}
        </>
      )}

      {head("Workers' compensation questions", "Answer Yes or No. Add a short explanation for any Yes.")}
      {ynRow("usesSubcontractors", "Are subcontractors used?", true)}
      {g("usesSubcontractors") === "Yes" && area("ynExplain_usesSubcontractors", "Please explain: what work is subcontracted (brief)", true)}
      {ynRow("coverageTerminated", "Any policy or coverage declined, cancelled or non-renewed in the last three years?", true)}
      {g("coverageTerminated") === "Yes" && area("coverageTerminatedExplanation", "Please explain: which carrier, when, and why")}
      {ynRow("carrierNonRenewing", "Is your current carrier non-renewing you?")}
      {g("carrierNonRenewing") === "Yes" && area("carrierNonRenewingExplanation", "Please explain: what reason did the carrier give?")}
      {WC_YN.map(([k, label, explain]) => (
        <div key={k} className="space-y-3">
          {ynRow(`yn_${k}`, label)}
          {explain && g(`yn_${k}`) === "Yes" && area(`ynExplain_${k}`, "Please explain (brief)")}
          {k === "outOfStateTravel" && g("yn_outOfStateTravel") === "Yes" && (<>{txt("travelStates", "Which other states do employees travel to or work in? (up to 10 states, two-letter codes)", { req: true, max: 40, ph: "AZ, NM, NV" })}<p className="text-xs opacity-70">List up to 10 states here. If more, list the extra states in the explanation box above.</p></>)}
          {k === "workFromHome" && g("yn_workFromHome") === "Yes" && txt("workFromHomeCount", "How many employees work from home?", { req: true, mode: "numeric" })}
        </div>
      ))}
    </div>
  );
}
