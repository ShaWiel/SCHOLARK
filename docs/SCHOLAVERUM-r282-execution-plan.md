# SCHOLAVERUM r282–r284: uitvoering en acceptatiecriteria

**Doel:** premium Claude-geïnspireerde ervaring zonder dubbele schermlagen, met een betrouwbare basis en veilig gegevensbeheer.

## Fase A — stabiliteit en accountgegevens (r282)
- Herstel profielrechten voor geauthenticeerde gebruikers in Supabase; RLS blijft eigenaargebonden en MFA blijft een restrictieve veiligheidsvoorwaarde.
- Eén canonieke Workspace-root; oude home/legacy UI mag nooit zichtbaar door de Workspace heen renderen.
- Nieuwe dashboardlayout met duidelijke volgorde: onderwijsniveaus, titel/intro, toolkaarten.
- Exporteer healthchecks voor dashboardduplicatie/overlap; regressietest home ↔ dashboard ↔ ARKI ↔ dashboard.
- Oude homepage blijft tijdelijk in de broncode als compatibility fallback, maar is voor eindgebruikers onzichtbaar; verwijder pas nadat alle interne afhankelijkheden zijn vervangen.

## Fase B — geleide producttour (r282)
- 'Explore the experience' opent een automatisch lopende rondleiding langs: platform, ARKI, AI Tutor, talen, scholen, Workspace, start.
- Pauze, hervatten, vorige/volgende, afsluiten en direct naar Workspace.
- Automatisch pauzeren bij handmatig scrollen of verborgen tab; verminder-beweging respecteren.
- Mobiele opmaak en ondersteuning voor toetsenbord/Escape.

## Fase C — vier oudere opdrachten (r282)
1. Rode account-/databasefouten, inclusief `permission denied for table profiles`, via minimale rechten + RLS.
2. Language Learner: bevestigde `Delete all` voor opgeslagen lessen en examens; voortgang veilig bijwerken.
3. Schools Near Me: `Remove` per opgeslagen school en `Remove all` met bevestiging.
4. Mandarin als dubbele taalkeuze verwijderen; Chinese `zh` behouden. Nooit ruwe gebruikersgegevens weggooien tijdens migratie.

## Fase D — diepere Workspace-modernisering (r283)
- Consistent ontwerp voor ARKI, AI Tutor, Planner, Language Learner, Schools Near Me, Projects/Files.
- Responsive sidebar/composer, leesbaarheid, rustigere oppervlakken en uniforme knopstijlen.
- Oude dubbele renderers en eventlisteners afbouwen zodra vervangende code betrouwbaar is.

## Fase E — foundation en productieacceptatie (r284)
- Hardening van route-eigenaarschap, geheugen, lazy-loading, foutafhandeling en accountisolatie.
- Test Firefox/WebKit/Chromium, 15-taals RTL-layout, bestaande AI-routes, opstart en gemengde navigaties.
- Deployment in fases; controleer GitHub CI, CodeQL, Render health en launch logs.
- Openstaande security/performance advisories beoordelen op risico; niet blind indexes verwijderen of service-rollen wijzigen.

## Afgerond bij
- Geen dubbele titels/kaarten op geteste Workspace-routes en schermformaten.
- Producttour doorloopt alle zeven stappen zonder de Workspace vast te zetten.
- Delete-acties werken alleen na juiste gebruikershandeling en bevestiging.
- Profiel wordt opgeslagen onder het eigen account en is ontoegankelijk voor andere ingelogde gebruikers.
- Geen zichtbare legacy-home bij routewisselingen.
- Geslaagde tests én gezonde productie-deploy.
