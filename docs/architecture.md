# Architecture

`conditional-access-posture-board` has two layers:

1. **Offline analyzer**
   - reads posture exports
   - computes findings and summary metrics
   - supports JSON, markdown, and summary CLI output

2. **Public operator surface**
   - renders overview, policy-lane, control-gap, exception-posture, verification, and docs views
   - prerenders static Pages output with `robots.txt`, `sitemap.xml`, and `CNAME`
