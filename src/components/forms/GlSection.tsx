"use client";

import { useEffect, useState } from "react";
import {
  YN_QUESTIONS, GENERAL_DETAILS, QUESTIONS_WITH_EXPLAIN, EXPLAIN_MAX, EXPLAIN_DEFAULT_MAX, TERMINATION_REASONS,
  ENTITY_TYPES, GL_EACH_OCCURRENCE, GL_GENERAL_AGGREGATE, GL_PRODUCTS_COMPOPS, GL_PERSONAL_ADV,
  GL_RENTED_PREMISES, GL_MEDICAL_EXPENSE, LOSS_LINES, SAFETY_ELEMENTS, POOL_FEATURES, RENT_EQUIPMENT_TYPES, MAX_LEN, detailName,
} from "@/lib/quote/quoteSpec";
import { SHARED_WITH_WC } from "@/lib/quote/glPayload";

// ACORD 125 / 126 / 140 (general liability) intake. Mounted ONLY while "General liability" is ticked in
// coverage_types. Field names are the canonical quoteSpec / map_quote_125.py names (also used by
// contractorschoiceagency.com and the ported sites); every one is declared in public/__forms.html.
// No policy-number, signature or signed-date field exists here. A yn_* radio has no default: unanswered stays blank.
// When Workers compensation is also ticked, names the WC block already renders (SHARED_WITH_WC) are not rendered again
// and their answers are read from `wcValues` so the follow-ups still appear.

const TRADE_OPTIONS = ["Asphalt sealcoating", "Crack sealing / filling", "Striping / pavement marking", "Paving / asphalt repair", "Other"];
const AGG_APPLIES = ["Per Policy", "Per Project", "Per Location", "Other"];

interface Props {
  inputClass: string;
  labelClass: string;
  wcOn: boolean;
  wcValues: Record<string, string>;
  onChange: (fields: Record<string, string>) => void;
}

export function GlSection({ inputClass, labelClass, wcOn, wcValues, onChange }: Props) {
  const [v, setV] = useState<Record<string, string>>({});
  const set = (k: string, val: string) => setV((p) => ({ ...p, [k]: val }));
  const own = (k: string) => !(wcOn && SHARED_WITH_WC.has(k));
  const g = (k: string) => (own(k) ? v[k] || "" : wcValues[k] || "");

  useEffect(() => { onChange(v); }, [v, onChange]);

  const txt = (name: string, label: string, o: { req?: boolean; type?: string; ph?: string; mode?: "numeric" | "decimal" } = {}) =>
    !own(name) ? null : (
      <div key={name}>
        <label htmlFor={`gl-${name}`} className={labelClass}>{label}{o.req ? " *" : ""}</label>
        <input id={`gl-${name}`} name={name} type={o.type || "text"} required={o.req} maxLength={MAX_LEN[name]} inputMode={o.mode} placeholder={o.ph} value={g(name)} onChange={(e) => set(name, e.target.value)} className={inputClass} />
      </div>
    );
  const area = (name: string, label: string, req = false, max?: number) => (
    <div key={name}>
      <label htmlFor={`gl-${name}`} className={labelClass}>{label}{req ? " *" : ""}</label>
      <textarea id={`gl-${name}`} name={name} rows={2} required={req} maxLength={max} value={g(name)} onChange={(e) => set(name, e.target.value)} className={`${inputClass} resize-none`} />
    </div>
  );
  const sel = (name: string, label: string, opts: string[], req = false) =>
    !own(name) ? null : (
      <div key={name}>
        <label htmlFor={`gl-${name}`} className={labelClass}>{label}{req ? " *" : ""}</label>
        <select id={`gl-${name}`} name={name} required={req} value={g(name)} onChange={(e) => set(name, e.target.value)} className={inputClass}>
          <option value="">Select…</option>
          {opts.map((o) => (<option key={o} value={o}>{o}</option>))}
        </select>
      </div>
    );
  const ynRow = (name: string, label: string, req = false) =>
    !own(name) ? null : (
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
  const checks = (name: string, label: string, opts: string[]) => {
    const cur = (g(name) || "").split(", ").filter(Boolean);
    return (
      <fieldset key={name} className="space-y-1.5">
        <legend className={labelClass}>{label} *</legend>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {opts.map((o) => (
            <label key={o} className="inline-flex items-center gap-2 text-sm text-espresso">
              <input type="checkbox" name={name} value={o} checked={cur.includes(o)} onChange={(e) => set(name, (e.target.checked ? [...cur, o] : cur.filter((x) => x !== o)).join(", "))} /> {o}
            </label>
          ))}
        </div>
      </fieldset>
    );
  };
  const head = (title: string, note: string) => (
    <div className="pt-5 border-t border-adobe">
      <h3 className="font-heading font-bold text-espresso text-sm uppercase tracking-wider">{title}</h3>
      <p className="text-xs text-mocha/70 mt-0.5">{note}</p>
    </div>
  );
  const two = (...kids: React.ReactNode[]) => <div className="grid sm:grid-cols-2 gap-4">{kids}</div>;
  const yes = (q: string) => g(`yn_${q}`) === "Yes";
  // Hidden by browsers if every child is null, so only render the grid when something is in it.
  const row = (...kids: React.ReactNode[]) => (kids.some(Boolean) ? two(...kids) : null);

  return (
    <div className="space-y-5" data-gl-section>
      {head("General liability details", "Because you picked General liability. Best estimates are fine; the agency completes the ACORD 125 / 126 / 140 from these answers.")}
      {row(txt("dba", "Doing business as (DBA)"), sel("entityType", "Business structure", ENTITY_TYPES, true))}
      {row(txt("fein", "FEIN (optional, leave blank for a new venture)", { ph: "12-3456789" }), txt("businessStartDate", "Date the business started", { type: "date", req: true }))}
      {row(sel("tradeType", "Type of work", TRADE_OPTIONS, true), txt("statesOfOperation", "States where you work", { req: true, ph: "AZ, NM" }))}
      {row(txt("sicCode", "SIC code (if known)", { mode: "numeric" }), txt("naicsCode", "NAICS code (if known)", { mode: "numeric" }))}

      {head("Business premises", "The business address above is used as the premises address.")}
      {row(txt("physicalCounty", "County of the business address", { req: true }), sel("premisesInterest", "Do you own or rent the premises?", ["Owner", "Tenant"], true))}
      {row(sel("premisesCityLimits", "Inside or outside city limits?", ["Inside City Limits", "Outside City Limits"], true))}
      {txt("locationDescription", "Describe the premises (yard, shop, office)", { req: true, ph: "Shop and equipment yard" })}

      {head("Your operation", "Employees, subcontractors and work mix.")}
      {row(txt("fullTimeEmployees", "Full-time employees", { req: true, mode: "numeric", ph: "0" }), txt("partTimeEmployees", "Part-time employees", { req: true, mode: "numeric", ph: "0" }))}
      {row(txt("residentialPct", "Residential work (percent)", { mode: "decimal" }), txt("commercialPct", "Commercial work (percent)", { mode: "decimal" }))}
      {ynRow("usesSubcontractors", "Do you use subcontractors?", true)}
      {txt("workSubcontractedPercent", "Percent of your work that is subcontracted (0 if none)", { req: true, mode: "decimal", ph: "0" })}
      {g("usesSubcontractors") === "Yes" && sel("subsCarryInsurance", "Do your subcontractors carry their own insurance?", ["Yes", "No"], true)}
      {g("usesSubcontractors") === "Yes" && txt("workSubcontractedDescription", "Type of work subcontracted", { req: true })}

      {head("General liability coverage requested", "Pick the limits you want quoted.")}
      {row(txt("desiredEffectiveDate", "Desired coverage start date", { type: "date", req: true }), txt("desiredExpirationDate", "Desired end date (optional, we default to 12 months)", { type: "date" }))}
      {two(sel("glEachOccurrence", "Each occurrence limit", GL_EACH_OCCURRENCE, true), sel("glGeneralAggregate", "General aggregate limit", GL_GENERAL_AGGREGATE, true))}
      {two(sel("glProductsCompOpsAggregate", "Products / completed operations aggregate", GL_PRODUCTS_COMPOPS, true), sel("glPersonalAdvertisingInjury", "Personal and advertising injury limit", GL_PERSONAL_ADV, true))}
      {two(sel("glDamageToRentedPremises", "Damage to rented premises limit", GL_RENTED_PREMISES, true), sel("glMedicalExpense", "Medical expense limit", GL_MEDICAL_EXPENSE, true))}
      {two(sel("glTrigger", "Occurrence or claims-made", ["Occurrence", "Claims Made"], true), sel("glAggregateAppliesTo", "How should the aggregate apply?", AGG_APPLIES, true))}
      {sel("billingPlan", "Billing plan", ["Direct Bill", "Agency Bill"], true)}

      {head("Current coverage and losses", "Carrier and expiration come from the prior-carrier fields above.")}
      {ynRow("currentlyInsured", "Are you insured today?", true)}
      {ynRow("lossesLast3Years", "Any general liability losses or claims in the last 3 years?", true)}
      {g("lossesLast3Years") === "Yes" && own("lossCount") && (
        <>
          {row(txt("lossCount", "Number of claims", { req: true, mode: "numeric" }), txt("lossDate", "Date of the most recent loss", { type: "date", req: true }))}
          {sel("lossLineOfBusiness", "Line of business", LOSS_LINES, true)}
          {area("lossDescription", "Brief description of what happened (no claimant names)", true, MAX_LEN.lossDescription)}
          {row(txt("lossAmountPaid", "Amount paid ($)", { req: true, mode: "numeric" }), txt("lossAmountReserved", "Amount reserved ($)", { req: true, mode: "numeric" }))}
          {row(sel("lossHistoryStatus", "Claim status", ["Open", "Closed"], true), sel("lossSubrogation", "Subrogation?", ["Yes", "No"], true))}
        </>
      )}
      {g("lossesLast3Years") === "Yes" && !own("lossCount") && sel("lossSubrogation", "Subrogation on the loss above?", ["Yes", "No"], true)}

      {head("General liability questions", "Answer every question Yes or No. A Yes opens a short follow-up.")}
      {YN_QUESTIONS.map((q) => {
        const k = q.key;
        const yk = `yn_${k}`;
        const answered = g(yk) === "Yes";
        return (
          <div key={k} className="space-y-3">
            {ynRow(yk, q.label, true)}
            {answered && QUESTIONS_WITH_EXPLAIN.includes(k) && own(`ynExplain_${k}`) && area(`ynExplain_${k}`, "Please explain your Yes answer (brief)", true, EXPLAIN_MAX[k] ?? EXPLAIN_DEFAULT_MAX)}
            {answered && (GENERAL_DETAILS[k] ?? []).map((f) => {
              const name = detailName(k, f.key);
              return txt(name, f.label, { req: true, type: f.kind === "date" ? "date" : "text", mode: f.kind === "percent" ? "decimal" : undefined });
            })}
            {k === "coverageTerminated" && answered && (
              <div className="space-y-3">
                <fieldset className="space-y-1.5">
                  <legend className={labelClass}>Reason the coverage was terminated (tick all that apply) *</legend>
                  <div className="flex flex-wrap gap-x-5 gap-y-1">
                    {TERMINATION_REASONS.map((r) => {
                      const n = `general_coverageTerminated__${r.key}`;
                      return (
                        <label key={r.key} className="inline-flex items-center gap-2 text-sm text-espresso">
                          <input type="checkbox" name={n} value="Yes" checked={g(n) === "Yes"} onChange={(e) => set(n, e.target.checked ? "Yes" : "No")} /> {r.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
                {ynRow("general_coverageTerminated__conditionCorrected", "Has the condition been corrected?")}
                {g("general_coverageTerminated__conditionCorrected") === "Yes" && txt("general_coverageTerminated__conditionCorrectedDescription", "How was it corrected?", { req: true })}
              </div>
            )}
            {k === "safetyProgramsExist" && answered && (
              <div className="space-y-3">
                {checks("safetyProgramElements", "Safety program elements", SAFETY_ELEMENTS)}
                {(g("safetyProgramElements") || "").split(", ").includes("Other") && txt("safetyOtherText", "Describe the other safety program", { req: true })}
              </div>
            )}
            {k === "athleticTeams" && answered && (
              <div className="space-y-3">
                {row(txt("athleticSportDescription", "Sport", { req: true }), sel("athleticContactSport", "Is it a contact sport?", ["Yes", "No"], true))}
                {row(txt("athleticSponsorshipExtent", "Extent of sponsorship", { req: true }), sel("athleticTeamAgeGroup", "Age group", ["12 and Under", "13 Through 18", "Over 18"], true))}
              </div>
            )}
            {k === "swimmingPool" && answered && (
              <div className="space-y-3">
                {sel("poolConstruction", "Pool construction", ["Above Ground", "In Ground"], true)}
                {checks("poolSafetyFeatures", "Pool safety features", POOL_FEATURES)}
              </div>
            )}
            {k === "rentOrLoanEquipment" && answered && (
              <div className="space-y-3">
                {checks("rentEquipmentTypes", "Type of equipment rented or loaned", RENT_EQUIPMENT_TYPES)}
                {ynRow("rentEquipmentInstructionGiven", "Is instruction given to renters?", true)}
              </div>
            )}
            {k === "leaseEmployees" && answered && ynRow("leaseEmployeesWorkersCompCarried", "Is workers compensation carried for the leased employees?", true)}
          </div>
        );
      })}
    </div>
  );
}
