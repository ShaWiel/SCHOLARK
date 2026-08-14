# SCHOLARK V24 — Generator-First Build Brief

## Product direction
SCHOLARK must stop feeling like a set of blank editors and start behaving like an AI-first creation platform. For presentations, reports and posters, the user should describe what they need and SCHOLARK should generate a complete first version automatically. The user then reviews, edits and exports.

Core UX principle: **Prompt in → complete first draft out.**

The product should reduce blank-page work. Users should not have to manually assemble slides, report sections or poster layouts before seeing useful output.

---

## 1. Presentation Generator

### Goal
Make the presentation flow feel closer to Gamma: the user provides a topic and a few options, then receives a fully assembled deck.

### Input
Required:
- Topic / prompt

Optional:
- Number of slides
- Language
- School level / audience
- Tone: school, professional, creative, persuasive
- Presentation goal
- Style preference

### Generation output
SCHOLARK generates the complete deck automatically:
- Title slide
- Logical slide order
- Slide titles
- Full slide copy / bullet points
- Speaker-note suggestions when useful
- Suggested visuals for each slide
- Consistent layout and theme
- Conclusion / final slide
- Source placeholders or citations when research mode is used

### UX
1. User enters prompt.
2. SCHOLARK shows a short generation state.
3. User lands directly on a complete presentation preview.
4. User can regenerate the whole deck or a single slide.
5. User can edit text, reorder slides and change style.
6. User can export.

### Acceptance criteria
- No empty deck is shown as the primary first result.
- A usable full presentation exists after one generation action.
- Every slide has content and layout.
- Regeneration works at whole-deck and single-slide level.

---

## 2. Report Generator

### Goal
The user should receive a near-complete report draft rather than an empty writing area.

### Input
Required:
- Topic / assignment

Optional:
- Report type
- Desired length
- Language
- School level / audience
- Tone
- Required sections
- Citation / research preference

### Generation output
SCHOLARK creates:
- Title
- Introduction
- Logical section structure
- Headings and subheadings
- Body text for each section
- Conclusion
- Optional recommendations
- Optional references / source section
- Research citations when research mode is enabled

### UX
1. User enters assignment.
2. SCHOLARK generates a complete first draft.
3. User reviews in an editable document view.
4. User can regenerate a paragraph, section or full report.
5. User can shorten, expand, simplify or formalize selected text.
6. User can export.

### Acceptance criteria
- The first result is a complete structured report, not a blank document.
- User can edit and selectively regenerate.
- The report maintains consistent structure and tone.

---

## 3. Poster Generator

### Goal
Generate a complete poster concept automatically instead of giving users a blank canvas first.

### Input
Required:
- Poster topic / purpose

Optional:
- Audience
- Poster type
- Style
- Color preference
- CTA
- Required text
- Orientation / size

### Generation output
SCHOLARK automatically creates:
- Headline
- Subheadline
- Supporting copy
- CTA
- Visual hierarchy
- Layout
- Theme
- Suggested or generated imagery
- Complete first poster composition

### UX
1. User describes the poster.
2. SCHOLARK generates a complete design.
3. User sees the finished first concept.
4. User can regenerate design, copy, image or layout separately.
5. User can edit and export.

### Acceptance criteria
- The first result is a complete visual composition.
- Text is already placed in a sensible hierarchy.
- The user does not need to assemble the design from scratch.

---

## 4. Persistent navigation / Home access

### Goal
Users must always be able to return to the SCHOLARK homepage.

### Requirement
Add a persistent top-level navigation element containing at minimum:
- Home
- AI Tools / Create
- Pricing
- Account

The SCHOLARK logo should also act as a Home link.

### Applies to
- Presentation Generator
- Report Generator
- Poster Generator
- Pricing
- Account / profile
- Learning tools
- Research
- Any modal / workspace that currently traps the user

### Acceptance criteria
- User can reach Home in one click from any major tool.
- No core workflow traps the user on a subpage.

---

## 5. Homepage explainer / advertisement section

### Goal
Explain SCHOLARK in very simple language for people who do not immediately understand what the platform does.

### Recommended section heading
**Weet je niet waar je moet beginnen? SCHOLARK wel.**

### Supporting copy
Typ gewoon wat je nodig hebt. SCHOLARK helpt je met leren, schrijven, ontwerpen en plannen — en maakt waar mogelijk al een complete eerste versie voor je.

### Four-step explainer
**1. Kies wat je wilt doen**  
Leer, maak een presentatie, schrijf een verslag, ontwerp een poster of vraag AI om hulp.

**2. Vertel kort wat je nodig hebt**  
Geef je onderwerp, niveau, taal en eventueel je voorkeuren door.

**3. SCHOLARK doet het voorwerk**  
Je krijgt automatisch een slimme eerste versie die al is opgebouwd en ingevuld.

**4. Controleer, pas aan en gebruik**  
Bewerk wat je wilt veranderen en exporteer of gebruik het resultaat.

### Promotional CTA copy
**Minder stress. Meer resultaat.**  
Begin niet meer vanaf een leeg scherm. Laat SCHOLARK je helpen om sneller van idee naar eindresultaat te gaan.

Primary CTA: **Probeer SCHOLARK gratis**

Secondary CTA: **Bekijk wat SCHOLARK kan**

### Optional visual treatment
Use a lightweight homepage demo / ad card that visually shows:
Prompt → Generating → Finished presentation/report/poster.

---

## 6. Generator-first architecture

Current editors should become the second step, not the first step.

### Old pattern
Open tool → blank editor → user manually builds → AI assists.

### New pattern
Open tool → enter intent → AI generates complete first draft → editor opens with generated content → user reviews / edits / exports.

This pattern should be shared between Presentations, Reports and Posters.

---

## 7. Regeneration controls

Every generated artifact should support scoped regeneration.

Presentation:
- Regenerate deck
- Regenerate slide
- Rewrite slide
- Make shorter / more detailed

Report:
- Regenerate report
- Regenerate section
- Rewrite paragraph
- Shorten / expand / simplify / formalize

Poster:
- Regenerate poster
- Regenerate layout
- Regenerate copy
- Regenerate image
- Change style

---

## 8. Quality requirements

Generated content should:
- Match the selected language.
- Match school level / intended audience.
- Avoid placeholder filler unless explicitly marked.
- Produce coherent structure, not isolated AI fragments.
- Preserve user edits unless the user chooses full regeneration.
- Never claim sources were consulted unless research mode actually retrieved them.

Natural Rewrite remains a writing-quality feature only and must not be positioned as detector evasion.

---

## 9. Plan / entitlement expectations

Premium access must be based on server-confirmed subscription state.

- Plus and Pro users in both `active` and valid `trialing` states must receive their plan entitlements.
- Free users must not gain premium access through client-side flags.
- Paddle webhook events remain the authoritative billing source.
- Existing billing sync defects must be resolved before public launch.

---

## 10. V24 implementation priority

P0 — must work before calling V24 complete:
1. Persistent Home navigation.
2. Generator-first Presentation flow.
3. Generator-first Report flow.
4. Generator-first Poster flow.
5. Homepage explainer section.
6. Plus/Pro entitlement sync works automatically after successful Paddle checkout/trial.
7. `trialing` and `active` both unlock the correct plan.

P1 — next:
- Single-section / single-slide regeneration.
- Better templates/themes.
- Export improvements.
- Research-backed report and presentation generation.

P2 — later:
- More design themes.
- Collaborative editing.
- Version history.
- Template marketplace / shared templates.

---

## Definition of done
V24 is not done merely because the buttons exist. It is done when a test user can:

1. Start from the homepage.
2. Ask for a presentation, report or poster.
3. Receive a complete first version automatically.
4. Edit or regenerate part of it.
5. Return Home in one click.
6. Start a Plus or Pro trial/subscription.
7. Immediately receive the correct premium entitlements.
8. Refresh or log back in and still retain those entitlements.
