# SCHOLARK V24 — SCHOLARK Studio Ultra-Quality Build Brief

## Product mandate
SCHOLARK must become an AI-first creation platform where the user can go from a short idea to a polished, editable, presentation-ready or publish-ready result without manually building the artifact from scratch.

The supplied Gamma screenshots and videos are a **minimum workflow benchmark only**. SCHOLARK must not copy Gamma branding or UI. It should implement an original SCHOLARK experience that covers the same broad creation categories while aiming for measurably higher output quality, stronger prompt fidelity, better research discipline and better editing controls.

Primary UX principle:

> **Describe it → SCHOLARK understands it → SCHOLARK plans it → SCHOLARK creates it → SCHOLARK quality-checks it → you review it.**

Users should not be dropped into a blank editor as the default workflow.

---

# 1. SCHOLARK Studio — unified Create hub

Add one central creation workspace called **SCHOLARK Studio**.

Top-level creation modes:

1. **Presentation**
2. **Webpage**
3. **Document**
4. **Social**
5. **Graphic**

The user can switch modes before generation without leaving Studio.

## Shared generation controls
Every mode should support the controls relevant to that format:

- Main prompt: “Describe what you want to create”
- Language
- Audience / school level / target group
- Tone / voice
- Length / number of slides / number of sections / number of assets
- Format / aspect ratio / page size where relevant
- Style or visual direction
- Theme
- Optional reference upload
- Optional source material upload
- Optional brand colors / logo / identity
- Optional factual-research mode
- Optional “use my exact instructions strictly” toggle
- Optional “surprise me / creative direction” mode

The creation page should also show useful example prompts that change based on the selected artifact type.

---

# 2. Ultra-Quality Generation Engine

SCHOLARK should not use a single shallow AI call for important artifacts. High-quality creation requires a staged pipeline.

## Required generation pipeline

### Stage A — Intent understanding
Before writing or designing, SCHOLARK determines:

- What the user actually wants
- The artifact type
- Audience
- Purpose
- Required depth
- Expected style
- Important constraints
- Whether factual research is required
- Whether supplied references must be followed

The system should preserve the user’s exact topic. It must not turn a prompt like “NBA GOAT Debate” into generic filler such as “The core in one image” or unrelated placeholder slides.

### Stage B — Planning
Create an internal content/design plan before final generation.

Examples:

Presentation:
- Narrative arc
- Slide sequence
- Purpose of each slide
- Evidence needed
- Visual strategy per slide

Document:
- Thesis / central question
- Section structure
- Argument flow
- Research needs
- Conclusion requirements

Webpage:
- Page goal
- User journey
- Information hierarchy
- Sections
- CTA strategy
- SEO structure when relevant

Social:
- Platform objective
- Hook
- Content sequence
- CTA
- Caption
- Visual rhythm

Graphic:
- Information hierarchy
- Visual format
- Data / text requirements
- Layout strategy
- Visual style

### Stage C — Research and grounding
When research mode is enabled or factual claims require verification:

- retrieve reliable sources
- prefer primary / authoritative sources where possible
- distinguish verified facts from interpretation
- store sources used
- attach citations or a source list to the artifact where suitable
- never fabricate URLs, studies, statistics or quotations

If the system cannot verify a factual claim, it should either omit it or clearly mark it for user review.

### Stage D — Content generation
Generate complete content based on the approved plan.

Requirements:
- strong prompt adherence
- coherent narrative, not disconnected AI fragments
- vocabulary appropriate to audience
- no generic filler
- no repeated points unless intentionally reinforcing a message
- no empty placeholder copy presented as finished content
- natural transitions
- specific, useful writing

### Stage E — Design generation
Apply a visual system automatically.

The design engine should decide:
- typography hierarchy
- spacing
- grid
- image placement
- color system
- density
- alignment
- component choice
- chart / table / timeline / quote / comparison / process block when appropriate

### Stage F — Critic pass
Before the user sees the result, run a structured quality review.

Critic checks:
- Did the output answer the actual prompt?
- Is the story logically ordered?
- Is anything repetitive?
- Are claims unsupported?
- Is the level right for the audience?
- Are titles meaningful?
- Does each section have a clear purpose?
- Is anything obviously AI-generic?
- Is there visual overload or excessive empty space?

### Stage G — Layout validation
Programmatically verify:
- no overlapping text
- no text outside the canvas
- no unreadably small type
- no clipped elements
- reasonable contrast
- sensible line lengths
- consistent margins
- no broken charts / tables
- correct export dimensions

If validation fails, automatically repair the artifact before showing it.

### Stage H — Final polish
Perform a final refinement pass for:
- wording
- hierarchy
- consistency
- spelling / grammar
- visual balance
- metadata
- export readiness

Only then show the finished first version.

---

# 3. Presentation Generator — flagship experience

## Goal
A user should be able to enter a prompt and receive a complete, professionally structured and visually designed deck that already looks intentional.

The presentation workflow should exceed the minimum capabilities demonstrated in the supplied reference by combining AI planning, research, writing, layout, visual selection and automated quality control.

## Presentation setup
Allow the user to choose:

- Topic / full prompt
- Audience
- Purpose
- Number of slides
- Language
- Tone / voice
- Content depth
- Theme
- Visual style
- Presentation style: academic, classroom, business, pitch, persuasive, storytelling, debate, research, minimalist, visual-first, etc.
- Reference file(s)
- Research mode
- Speaker notes on/off
- Citation style when appropriate

## Outline step
Before final generation, SCHOLARK should show an editable outline.

The user can:
- rename slides
- reorder slides
- add a slide
- remove a slide
- tell AI to strengthen the structure
- request a different angle
- proceed immediately without editing

## Full-deck generation
Every slide must be intentionally designed, not copied from one repeated template.

Supported slide patterns should include:
- hero / title
- section divider
- key statement
- text + image
- comparison
- pros / cons
- quote
- timeline
- process
- data / statistics
- chart
- table
- profile / person
- multi-card layout
- image-led storytelling
- argument / counterargument
- case study
- summary
- conclusion
- Q&A

SCHOLARK chooses patterns based on the content, not randomly.

## Visual intelligence
For each slide, the generator decides whether it needs:
- image
- icon
- diagram
- timeline
- table
- chart
- quote treatment
- pure typography

Visuals must support the message instead of being decorative noise.

## Editing
After generation:
- edit text directly
- drag / reorder slides
- duplicate / delete
- add text, shape, image, table, chart
- change theme globally
- change layout for a slide
- regenerate selected slide
- rewrite selected text
- make slide shorter
- make slide more visual
- make slide more academic
- add evidence
- add citation
- change the image
- apply instruction to one slide or all slides

## AI Design Assist
Users can type natural-language editing commands such as:
- “Make this slide more visual.”
- “Use less text and a stronger headline.”
- “Turn this into a comparison.”
- “Add a timeline.”
- “Make the whole deck look more premium.”
- “Use a darker editorial style.”
- “Make this suitable for a 16-year-old student.”

## Export
Required:
- PPTX
- PDF
- shareable web view

Future:
- Google Slides export

## Presentation acceptance test — NBA GOAT Debate
Given a prompt like:

“Create a 12-slide presentation for a class 5 VWO debate about who is the NBA GOAT. Compare Michael Jordan, LeBron James and Kareem Abdul-Jabbar using championships, individual awards, longevity, era context, advanced statistics and arguments used by both sides. Make it visually strong, balanced and suitable for a classroom debate.”

SCHOLARK must generate:
- a meaningful 12-slide narrative
- relevant comparison structure
- evidence-led content
- clear debate framing
- no generic placeholder titles
- readable slide layouts
- visual variation
- conclusion that acknowledges evaluation criteria rather than pretending the debate has one objective answer

---

# 4. Document Generator — reports, essays and professional documents

The **Document** mode must be broader than only school reports.

Supported artifact families:
- school report
- research report
- essay
- assignment
- article
- proposal
- business report
- project report
- white paper
- policy brief
- study guide
- summary
- CV / résumé draft
- prospectus-style document
- handbook
- custom document

## Document setup
Inputs:
- prompt / assignment
- document type
- audience / level
- desired length
- language
- tone
- citation style
- required structure
- reference files
- research mode
- exact teacher / organization requirements

## Outline first
Before generating the full document, create a strong outline showing:
- title
- central question / purpose
- sections
- subsection logic
- evidence required
- expected conclusion

User can edit the outline before generation.

## Full document generation
Generate a complete first draft with:
- strong opening
- logical headings
- coherent paragraphs
- evidence where needed
- transitions
- conclusion
- references when research mode is used

## Report quality engine
Reports must be evaluated for:
- thesis / objective clarity
- argument consistency
- evidence quality
- source reliability
- repetition
- unsupported statements
- structure
- level appropriateness
- grammar
- readability
- citation consistency

A report should not read like an AI-generated list of obvious statements.

## Advanced document editing
User can select any text and request:
- rewrite
- expand
- shorten
- simplify
- formalize
- make more academic
- add evidence
- explain better
- improve transitions
- make argument stronger
- challenge this argument
- add counterargument
- fact-check selected claim
- add citation

## Document export
Required:
- DOCX
- PDF
- clean copy / paste

Future:
- Google Docs export

---

# 5. Webpage Generator

Users must be able to generate complete web pages from a prompt.

## Supported webpage types
- landing page
- personal site
- portfolio
- school project page
- event page
- product page
- service page
- campaign page
- simple multi-section business page
- custom page

## Webpage setup
Inputs:
- page purpose
- target audience
- language
- tone
- sections
- CTA
- style
- brand colors / logo
- reference page / image if supplied by user
- desired number of sections

## AI output
SCHOLARK creates:
- information architecture
- hero
- headings
- body copy
- CTA blocks
- visual sections
- cards
- FAQ if relevant
- social proof placeholders only when user supplies real proof or asks for placeholders
- footer

## Webpage quality
Generated pages must be:
- responsive
- accessible
- readable
- visually consistent
- mobile-friendly
- structured with semantic headings
- optimized for clear conversion or communication goal

Never invent customer testimonials, awards or company facts as real claims.

## Webpage editor
Allow:
- reorder sections
- edit copy
- regenerate a section
- change layout
- change theme
- add image / card / CTA / FAQ / gallery / feature block
- preview desktop / tablet / mobile

## Output
- publishable hosted preview
- exportable HTML/CSS package in a later phase

---

# 6. Social Generator

Users must be able to create social content, not only text captions.

## Supported social formats
- Instagram post
- Instagram carousel
- Instagram story
- LinkedIn post visual
- LinkedIn carousel
- Facebook post visual
- TikTok cover / static concept
- YouTube thumbnail
- announcement
- educational carousel
- campaign asset
- quote card
- custom social graphic

## Controls
- platform
- aspect ratio
- number of cards / slides
- target audience
- tone
- brand identity
- CTA
- language
- visual style
- image style

## AI output
Generate:
- hook
- card-by-card structure
- final copy
- design
- caption
- CTA
- optional hashtag suggestions
- alternative variants

Social output must optimize for clarity and attention without resorting to fake engagement bait or fabricated facts.

---

# 7. Graphic Generator

Graphic mode must cover the categories demonstrated in the supplied reference and go further.

## Supported graphic types
- infographic
- poster
- organization / team structure
- invitation / save-the-date
- calendar / schedule
- timeline
- process diagram
- flowchart
- concept diagram
- comparison graphic
- educational visual
- data visual
- logo concept
- social media graphic
- certificate-style layout
- custom graphic

## Controls
- graphic type
- canvas ratio / dimensions
- number of variants
- amount of imagery
- language
- visual style
- image style
- color system
- reference upload
- brand assets

## Image style library
Examples:
- photographic / scene
- illustration
- flat line art
- technical line
- modern art
- editorial
- 3D
- sketch
- minimal
- collage
- no image

SCHOLARK should support style expansion over time without coupling the generation logic to a fixed short list.

## Graphic quality requirements
- clear hierarchy
- aligned layout
- correct reading order
- sensible amount of text
- no tiny unreadable labels
- accurate charts where data is supplied
- no fake data
- visual consistency

---

# 8. Reference-aware creation

All Studio modes should allow the user to add references.

Reference types:
- image
- PDF
- DOCX
- PPTX
- text / notes
- brand asset

Use references for:
- style inspiration
- required content
- factual context
- structure
- branding

The model must distinguish between:
- “use this as source material”
- “use this as visual inspiration”
- “follow this exact structure”

Do not blindly reproduce copyrighted designs. Use references to understand direction and produce an original SCHOLARK result.

---

# 9. Themes, templates and design systems

SCHOLARK should offer quality theme systems rather than a large set of weak templates.

Initial directions:
- Minimal
- Editorial
- Academic
- Modern business
- Bold / high impact
- Premium dark
- Soft / calm
- Futuristic
- Playful education
- Data-driven

Each theme defines:
- typography pair
- type scale
- spacing system
- color palette
- shape language
- image treatment
- chart style
- card style

Users can change theme after generation without destroying the content structure.

---

# 10. Quality must be measurable, not just claimed

The target is for SCHOLARK output to compete with or outperform leading AI creation tools. This must be validated through repeatable evaluation, not marketing claims.

## Internal quality score
Every generated artifact receives an internal score across:
- Prompt fidelity
- Completeness
- Structure
- Writing quality
- Factual reliability
- Audience fit
- Visual hierarchy
- Layout validity
- Consistency
- Editability

Artifacts below a configured quality threshold should automatically run another repair pass.

## Benchmark suite
Create a benchmark set containing difficult prompts for:
- classroom presentations
- debate decks
- research presentations
- business decks
- essays
- formal reports
- web landing pages
- social carousels
- infographics
- posters

For each benchmark, evaluate SCHOLARK against current leading creation tools using the same prompt where practical.

Score without favoring SCHOLARK. The goal is to find weaknesses and improve them.

## Non-negotiable layout metrics
- zero overlapping content
- zero clipped text in accepted output
- no inaccessible microscopic body text
- consistent slide/page margins
- no accidental duplicate headings
- no empty generated cards
- no placeholder lorem ipsum in final output

## Writing metrics
- no obvious filler
- no fake sources
- no invented quotations
- no hallucinated statistics presented as fact
- meaningful section titles
- minimal redundancy
- clear conclusions

---

# 11. User control: regenerate at any level

Users must never be forced to throw away the entire artifact for one bad section.

## Shared regeneration scopes
- regenerate all
- regenerate selected page / slide / section / card
- rewrite selected text
- redesign selected block
- change image only
- change layout only
- change tone only
- change theme globally
- apply instruction to selection
- apply instruction to entire artifact

Preserve manual user edits unless the requested operation explicitly replaces them.

---

# 12. Versions and undo

Creation tools need strong recoverability.

Required:
- undo / redo
- autosave
- saved generated version before major regeneration
- ability to restore a previous version

Later:
- named versions
- compare revisions

---

# 13. Home navigation and workspace escape

Users must always be able to return to SCHOLARK Home.

## Required persistent navigation
At minimum:
- SCHOLARK logo → Home
- Home
- Studio
- Learning
- Projects / creations
- Pricing
- Account

The creation editor may use a compact navigation bar, but Home must remain one click away.

No modal or editor should trap the user.

---

# 14. Homepage mini AI explainer / advertisement

The homepage must contain a clear visual explainer for users who do not understand SCHOLARK immediately.

## Section headline
**Weet je niet waar je moet beginnen? SCHOLARK wel.**

## Supporting copy
Beschrijf wat je wilt leren of maken. SCHOLARK helpt je van eerste idee tot een complete eerste versie — of je nu een presentatie, verslag, webpagina, social post of graphic nodig hebt.

## Mini AI demo / commercial sequence
Show a short autoplay-muted explainer animation/video or interactive demo:

1. User types a prompt.
2. SCHOLARK understands the assignment.
3. An outline / plan appears.
4. SCHOLARK generates the complete artifact.
5. The result is polished automatically.
6. User reviews, edits and exports.

Include controls:
- play / pause
- captions
- replay

Do not autoplay sound.

## CTA
Primary: **Start gratis**

Secondary: **Bekijk hoe SCHOLARK werkt**

## Simple four-step explanation
1. **Kies wat je wilt doen** — leren, presenteren, schrijven, ontwerpen of researchen.
2. **Vertel wat je nodig hebt** — onderwerp, niveau, taal, stijl en eisen.
3. **SCHOLARK bouwt de eerste versie** — inhoud én structuur, en bij visuele projecten ook het ontwerp.
4. **Jij controleert** — pas aan, regenereer onderdelen en exporteer.

---

# 15. Premium plan behavior

Billing and feature access must be reliable before public release.

- `active` Plus / Pro → correct entitlement
- valid `trialing` Plus / Pro → correct entitlement immediately
- cancellation / expiration → entitlement updates correctly
- refresh / re-login must preserve plan access
- browser-controlled flags may never grant premium access
- Paddle webhook state remains server-authoritative

The existing webhook-to-Supabase 401 defect must be fixed before the billing system is considered complete.

---

# 16. Quality tiers without making Free intentionally bad

All plans should produce coherent, usable results.

Possible differentiation:

## Free
- high-quality core generation
- lower monthly / daily limits
- fewer variants
- standard image generation allowance

## Plus
- larger artifacts
- more generations
- research-backed creation
- more image generations
- advanced themes
- more exports

## Pro
- highest reasoning / quality budget
- deeper research passes
- more design variants
- higher image limits
- advanced Studio workflows
- longest documents / decks

Do not deliberately degrade factual accuracy or basic quality on Free. Differentiate primarily by depth, limits and advanced features.

---

# 17. Performance and progress UX

High quality can take longer, so generation must feel transparent.

Show meaningful progress such as:
- Understanding your request
- Building the structure
- Researching key facts
- Writing content
- Designing layouts
- Checking quality
- Finalizing

Do not show fake percentages unless progress can actually be estimated.

Allow the user to cancel generation.

---

# 18. Safety, education and originality

- Natural Rewrite remains a writing-quality feature, not detector bypass.
- Never promise plagiarism evasion.
- Generated academic content should encourage user review and understanding.
- Do not fabricate research or sources.
- Preserve age-appropriate content handling.
- Reference-based creation should produce original layouts and wording rather than copying protected designs.

---

# 19. P0 implementation scope

V24 should not be declared complete until these work end-to-end:

1. Unified SCHOLARK Studio with Presentation, Webpage, Document, Social and Graphic modes.
2. Persistent Home navigation.
3. Presentation: prompt → outline → complete polished deck → edit → export.
4. Document: prompt → outline → complete polished document → edit → export.
5. Webpage generator with responsive preview.
6. Social generator with complete visual + copy output.
7. Graphic generator covering poster, infographic, diagrams and other core formats.
8. Reference uploads.
9. Theme / visual-style selection.
10. Scoped regeneration.
11. Automatic quality critic pass.
12. Layout validation and repair.
13. Homepage mini AI explainer / commercial.
14. Plus / Pro billing entitlement sync fixed.
15. `trialing` and `active` states both unlock correctly.

---

# 20. Definition of done

V24 is not complete because a button exists or because AI returned text.

A build is accepted only when a fresh test user can:

1. Open SCHOLARK Home.
2. Open Studio.
3. Choose Presentation, Webpage, Document, Social or Graphic.
4. Enter a detailed or simple prompt.
5. Receive a relevant plan / outline where appropriate.
6. Generate a complete first artifact without manually assembling it.
7. Receive clean layout with no overlap or placeholder junk.
8. See writing that follows the actual prompt and audience.
9. Edit or regenerate only the part they dislike.
10. Change visual direction without losing the content.
11. Return Home in one click.
12. Save and reopen their creation.
13. Export in the format appropriate to the artifact.
14. Start a Plus or Pro trial / subscription.
15. Immediately receive correct premium access.
16. Refresh or sign back in and retain that access.

---

# Final product standard

The SCHOLARK Studio goal is not “AI that can technically make a presentation or document.”

The goal is:

> **A user gives SCHOLARK an idea and receives a result polished enough that their first reaction is to review it, not rebuild it.**

Quality leadership should be pursued through stronger reasoning, research discipline, writing, visual systems, validation and measurable benchmarking — not by making unverifiable claims that SCHOLARK is automatically better than every competitor before it has been tested.
