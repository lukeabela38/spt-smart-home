# Verification

Tested on Samsung UE75DU7172UXXH on 28 October 2026.

- 11 direct-CDP assertions passed: six app shortcuts, remote selection, matching
  accessible/visual selection, unclipped layout, spacing, no idle animation,
  reduced-motion support, label contrast above 7:1 and no observed runtime errors.
- App launching, double-press handling, focus retention and returning to the launcher passed.
- Final installation checks passed; diagnostics were disabled afterwards.
- Power-on behaviour requires a separate check with the TV's startup settings.

Samsung Tizen skills 1.6.1 registered the SDK and ran the assertion script.
The generic debugging helper misclassified the retail web app, so the project's
TV-specific debug setup was used. Playwright attachment failed on an unsupported
browser-context command; direct CDP supplied the working test transport.
