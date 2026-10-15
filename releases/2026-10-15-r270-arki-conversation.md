# SCHOLAVERUM r270 — ARKI conversational replies

Release candidate for the merged and reviewed PR #39.

- ARKI responds conversationally to greetings, short follow-ups, explanations, normal chat, writing requests and troubleshooting, using relevant chat history and the user's chosen language and register.
- Step-by-step calculations, precise rules and worked examples remain available when helpful, without enforcing worksheet headings for short questions.
- Safe, readable chat rendering supports natural paragraphs, emphasis, lists, code and in-chat HTML previews.
- Changed runtime asset version so browsers refresh the updated ARKI client code after deploy.
- Existing session-refresh, credit authorization, Connect Coming Soon, Tutor and other workspace features remain unchanged.

Release only after CI, CodeQL, the explicit Release Gate and live smoke pass. A real signed-in human review is still needed to assess subjective conversational quality; deterministic tests cannot prove every model response is natural.
