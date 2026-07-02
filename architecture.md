## Technical Architecture

### Progress List Upload Formatter

Version: 1.2
Owner: Brandon Gittelman, Marketing Technical Architect, Principal
Last Updated: July 2026

v1.2 headline changes: Fuzzy matcher rewritten (token-overlap + parenthetical stripping + stopwords). Router preserves scroll and focus across re-renders. columnSynonyms expanded to cover all 37 template columns. Step 4 must not call store.set() inside render(). See updatelog.md v1.2 before regenerating.

v1.1 headline: No NPM/Node. Third-party libraries via UMD/CDN or local vendor/ folder.

---

#### 1. Architecture Philosophy

Client-only, zero-build, zero-NPM. Runs entirely in the browser. No PII leaves the browser. Static file deployment.

---

#### 2. Tech Stack (unchanged from v1.1)

- Markup: HTML5 (single index.html)
- Styling: Plain CSS3 with Custom Properties
- Scripting: Vanilla JS ES2020+ as ES modules
- State: Hand-written pub/sub store (~60 LOC)
- File Parsing: SheetJS UMD
- Fuzzy Matching: Fuse.js UMD (SOFT fallback only in v1.2, see §4.2)
- Data Grid: Hand-rolled table
- Date Handling: Native
- Icons: Inline SVG
- Fonts: System + optional Mulish woff2
- Hosting: Static hosting

##### 2.2 Project Layout

progress-list-upload/
  index.html
  picklists.json
  styles/
    tokens.css
    base.css
    components.css
    steps.css
  js/
    app.js
    store.js
    router.js               -- includes scroll+focus preservation (v1.2)
    modules/
      parser.js
      fuzzy.js              -- token-overlap algorithm (v1.2)
      country.js
      validator.js
      exporter.js
      picklists.js
    ui/
      header.js
      stepIndicator.js
      nav.js
      step1-upload.js
      step2-mapping.js
      step3-settings.js
      step4-review.js       -- MUST NOT call store.set() in render() (v1.2)
      step5-export.js
    util/
      dom.js
      date-utils.js
      csv.js
  README.md

Deliberately absent: package.json, node_modules/, vite.config.*, tsconfig.json, .babelrc, webpack.*.

---

#### 3. Data Flow

Same as v1.1. Pipeline: Upload -> Parse -> Map -> Enrich -> Validate -> Edit -> Serialize -> Download.
Same JSDoc typedefs as v1.1: SourceFile, BatchSettings, ProcessedRow.
Wizard state machine unchanged.

---

#### 4. Core Modules

##### 4.1 File Parser (js/modules/parser.js)
SheetJS wrapper. Handles .xlsx / .xls / .csv. Preserves diacritics. Error handling for corrupt / empty / oversized files.

##### 4.2 Fuzzy Matcher (js/modules/fuzzy.js) -- REWRITTEN v1.2

The v1.1 implementation used Fuse.js's character-level similarity as the primary matcher. That failed on real-world vendor headers such as PRODUCT (use drop down menu) because the noise words dominated the character similarity score. The v1.2 implementation adds two prepasses.

Algorithm (in order):

  1. Normalize the source column:
     - Lowercase.
     - Strip parenthetical hints: "product (use drop down menu)" becomes "product".
     - Strip bracketed hints: "email [required]" becomes "email".
     - Convert underscores / dashes / dots / commas / slashes to spaces.
     - Remove other punctuation.
     - Collapse whitespace.
  2. Tokenize, filtering stopwords: use, menu, drop, down, dropdown, select, please, value, the, a, an, of, or, and.
  3. Exact / synonym hit. If the normalized source matches a normalized synonym for an unclaimed template column, use it with HIGH confidence.
  4. Token-overlap prepass (Jaccard). For each template, compare source token set to alias token sets; take highest Jaccard. If >= 0.5, claim the template. Confidence: >= 0.9 High, >= 0.7 Medium, else Low.
  5. Fuse.js soft fallback. Threshold 0.5, flattened synonym corpus.
  6. Last-chance overlap. If >= 0.25 Jaccard, return with LOW confidence rather than "None".

Templates claimed by earlier iterations are excluded (first-wins).

##### 4.3 Country Standardizer (js/modules/country.js)
Same as v1.1. Alias map from picklists.json. Flags unmapped values.

##### 4.4 Validator (js/modules/validator.js)
Rules: whitespace trim, name cleanup, checkbox coercion, country standardization, required fields, email format, SFDC ID = 18, picklist conformance, Force MQL/MAL exclusivity, duplicate email (warning), email+Product uniqueness (error).

v1.2 note: Validator itself unchanged. The v1.2 fix is at the UI layer -- Step 4's render must not call store.set({ processedRows }) or it triggers an infinite loop. Cache module-locally.

##### 4.5 Exporter (js/modules/exporter.js)
Same as v1.1. SheetJS write, CSV with BOM, 37 columns in Title Case, checkbox -> Yes/blank.

##### 4.6 Picklist Loader (js/modules/picklists.js)
Fetch + schema-validate + cache. Blocking modal on failure.

---

#### 5. picklists.json Schema

The root object has three keys: picklists, columnSynonyms, countryAliases.

- picklists -- object mapping picklist name to an array of allowed string values. Required keys: Country, Product, Lead Source - Initial, Lead Source - Most Recent, Call to Action, Target Channel Type, Campaign Member Status, utm_medium.
- columnSynonyms -- object mapping template column name to an array of alias strings the fuzzy matcher will treat as equivalent. v1.2 expanded -- see §5.1 below.
- countryAliases -- object mapping canonical country name to an array of alias strings.

Validation on load: root has all three keys; all required picklists present; values are non-empty strings, no duplicates (case-insensitive).

##### 5.1 columnSynonyms -- EXPANDED v1.2

Minimum required set covering all 37 mappable template columns. Each row lists the template column, then its aliases:

- First Name: first, fname, firstname, first name, given name, first_name, FIRST NAME, First
- Last Name: last, lname, lastname, last name, surname, family name, last_name, LAST NAME, Last
- Email Address: email, e-mail, email address, mail, emailaddress, email_address, EMAIL ADDRESS, Email, E-Mail
- Company Name: company, organization, org, account, company name, employer, organisation, company_name, COMPANY NAME, Company
- Address 1: address, address 1, address1, street, street address, address_1, addr1, ADDRESS 1, Address
- City: city, town, locality, CITY
- State or Province: state, province, state or province, region, state/province, state_or_province, STATE OR PROVINCE, State
- Zip or Postal Code: zip, postal, postal code, zip code, postcode, zip or postal code, zip_or_postal_code, ZIP OR POSTAL CODE, Zip, Postal Code
- Country: country, nation, country/region, country or region, country_region, COUNTRY, COUNTRY (use drop down menu), Country (use drop down menu)
- Business Phone: phone, business phone, telephone, tel, work phone, phone number, business_phone, BUSINESS PHONE, Business Phone
- Title: title, job title, position, role, TITLE, Job Title
- Industry: industry, sector, vertical, INDUSTRY
- Revenue: revenue, annual revenue, sales, REVENUE
- Employee Size: employees, employee size, employee count, company size, headcount, employee_size, EMPLOYEE SIZE
- Electronic Message Opt Out: opt out, email opt out, electronic message opt out, ELECTRONIC MESSAGE OPT OUT
- Opt In - Explicit Date: opt in date, opt-in date, opt in - explicit date, OPT IN - EXPLICIT DATE
- Campaign Source: campaign source, campaign, source, campaign_source, CAMPAIGN SOURCE
- Lead Source - Initial: lead source initial, lead source - initial, initial lead source, LEAD SOURCE - INITIAL
- Lead Source - Most Recent: lead source most recent, lead source - most recent, most recent lead source, LEAD SOURCE - MOST RECENT
- Product: product, products, product line, product name, PRODUCT, PRODUCT (use drop down menu), Product (use drop down menu)
- Call to Action: call to action, cta, CALL TO ACTION, Call To Action, Call-to-Action
- Target Channel Type: target channel, channel, channel type, target channel type, TARGET CHANNEL TYPE
- Form Comments: comments, notes, form comments, lead comments, message, remarks, FORM COMMENTS
- Offer Title: offer, offer title, asset title, OFFER TITLE
- Website: website, url, web, site, web site, WEBSITE
- Campaign Member Status: campaign member status, member status, status, CAMPAIGN MEMBER STATUS
- SFDC Campaign ID: sfdc campaign id, salesforce campaign id, campaign id, sfdc id, sfdcid, SFDC CAMPAIGN ID, Salesforce Campaign ID
- utm_medium: utm medium, utm_medium, utmmedium, medium, UTM_MEDIUM, UTM Medium
- utm_source: utm source, utm_source, utmsource, UTM_SOURCE, UTM Source
- utm_campaign: utm campaign, utm_campaign, utmcampaign, UTM_CAMPAIGN, UTM Campaign
- Force MQL: force mql, forcemql, FORCE MQL
- Force MAL: force mal, forcemal, FORCE MAL
- External Asset Status: external asset status, asset status, EXTERNAL ASSET STATUS
- Lead Owner ID: lead owner id, owner id, salesforce owner id, LEAD OWNER ID, Lead Owner, LEAD OWNER
- Manual Lead Assignment: manual lead assignment, manual assignment, MANUAL LEAD ASSIGNMENT
- Bypass Bogus Program: bypass bogus program, bypass bogus, BYPASS BOGUS PROGRAM

---

#### 6. Component Architecture

##### 6.1 Store (unchanged from v1.1)

The store is a small pub/sub built on EventTarget. Skeleton:

  export const store = (() => {
    const target = new EventTarget();
    let state = { /* WizardState */ };
    return {
      get: () => state,
      set: (patch) => {
        state = { ...state, ...patch };
        target.dispatchEvent(new CustomEvent('change', { detail: state }));
      },
      subscribe: (fn) => {
        const h = (e) => fn(e.detail);
        target.addEventListener('change', h);
        return () => target.removeEventListener('change', h);
      }
    };
  })();

##### 6.2 Router with Scroll + Focus Preservation (NEW v1.2)

Every store change triggers a full re-render. Naively that resets scroll and steals focus on every keystroke. The router MUST:

  1. Only scroll to top on step transitions. Track lastRenderedStep module-locally.
  2. Capture and restore scroll position if step didn't change: capture window.scrollY before mount, restore after mount, then again in requestAnimationFrame twice (Windows browsers can defer layout).
  3. Disable browser scroll restoration: history.scrollRestoration = 'manual'.
  4. Capture and restore focus: read document.activeElement.id, selectionStart, selectionEnd, selectionDirection. After mount, look up by id, call .focus({ preventScroll: true }), then .setSelectionRange(...).

Every input, select, checkbox, and button MUST have a deterministic stable id (for example f-<fileId>-CampaignSource, row-<sourceFileId>-<rowIndex>-<column>). Do NOT use random or index-only ids.

Router skeleton:

  let lastRenderedStep = null;

  export function render() {
    try {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    } catch (e) {}

    const s = store.get();
    const scrollY = window.scrollY;
    const stepChanged = s.step !== lastRenderedStep;
    const focusSnap = stepChanged ? null : captureFocus();

    try {
      // render chrome + step content, then mount
    } finally {
      if (stepChanged) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, scrollY);
        requestAnimationFrame(() => {
          if (window.scrollY !== scrollY) window.scrollTo(0, scrollY);
          restoreFocus(focusSnap);
        });
        requestAnimationFrame(() => {
          if (window.scrollY !== scrollY) window.scrollTo(0, scrollY);
        });
      }
      lastRenderedStep = s.step;
    }
  }

##### 6.3 Step Modules -- DO NOT store.set() inside render()

Calling store.set() inside render triggers the store's change event, which re-runs render, which triggers store.set() again -- infinite loop. Cache derived state module-locally instead:

  // js/ui/step4-review.js
  let processedCache = null;

  export function render() {
    const s = store.get();
    const rows = buildProcessedRows(s.files, s.rowOverrides, s.manualUncheckedMLA);
    processedCache = rows;   // module-local; NOT store.set()
    // ...render grid...
    return card;
  }

  export function canContinue() {
    const rows = processedCache || [];
    return !rows.some(r => r.validations.some(v => v.severity === 'error'));
  }

---

#### 7. Multi-File Merge

Same as v1.1. Per-file state; combined output; duplicate email (warning); email+Product (error); multi-campaign filename fallback.

---

#### 8. Validation Engine Details

Same as v1.1. Per-row validators (required, email, SFDC ID, picklist, Force MQL/MAL) then cross-row validators (DuplicateEmail warning, DuplicateEmailWithinProduct error).

---

#### 9. Future Backend Integration

Same as v1.1: saved profiles, audit log, direct Eloqua, picklist admin, SSO.

---

#### 10. Error Handling

Same as v1.1 plus: silent JS exceptions in a step's render are swallowed by the router's try/finally so scroll/focus restore still runs.

---

#### 11. Performance

- Large files: chunked parse via requestIdleCallback.
- Data grid: cap at 500 visible rows with footer, virtualization is v2.
- v1.2: Full-card re-render on every keystroke is fine because focus+scroll are preserved. If Step 4 becomes slow at 5k rows, fix is targeted DOM patching, not architectural change to router.

---

#### 12. Security & Compliance

No PII transmission; no persistence; strict CSP; SHA-256 SRI hashes on vendor JS.

---

#### 13. Deployment

Client-only static hosting. Local dev: python -m http.server 8080 or VS Code Live Server. Do NOT use npx serve or any Node tool.

---

#### 14. Testing Strategy

##### 14.1 Syntax Validation (MANDATORY v1.2)

Run before every commit:

  for f in js/**/*.js; do node --check "$f" || echo "FAIL: $f"; done

Every .js file MUST pass.

##### 14.2 In-Browser Scroll + Focus Smoke Test (MANDATORY v1.2)

Paste in DevTools Console:

  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const now = window.scrollY;
    if (Math.abs(now - lastY) > 50) {
      console.log('SCROLL JUMP:', lastY, '->', now);
      console.trace();
    }
    lastY = now;
  }, true);

Then run through:

  1. Upload file with PRODUCT (use drop down menu) and COUNTRY (use drop down menu) headers. Step 2 must show High confidence auto-mapping.
  2. Upload file with all-uppercase headers. All must auto-map with High confidence.
  3. Step 3: scroll halfway, click Force MQL. No scroll jump. Focus stays on checkbox.
  4. Step 3: type in Campaign Source. No jump. Cursor stays; no lost characters.
  5. Step 3: type in Lead Owner ID. Manual Lead Assignment auto-checks. Focus stays.
  6. Step 4: click a row checkbox. No jump. Row updates in place.
  7. Load 5k rows. Must not freeze.

##### 14.3 Test File Set

- Single-file happy path
- Multi-file with mixed Products
- International characters (Jürgensen, Lörtsch)
- Duplicate emails, same Product -> error
- Duplicate emails, different Products -> warning
- Invalid SFDC IDs
- Country variants (US, UK, Vietnam, Taiwan)
- Lead Owner ID populated but MLA unchecked -> verify auto-check
- Bypass Bogus Program toggled -> export contains "Yes"
- v1.2: File with PRODUCT (use drop down menu) header
- v1.2: File with all-UPPERCASE headers