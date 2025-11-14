# Cakify Seed Data

Use these JSON files to populate Supabase tables or local mocks.

- `bakers.json` — 5 curated bakers with verified metadata.
- `cakes.json` — 10 companion cake listings referencing the bakers above.

### Import tips

1. Upload the JSON via Supabase Table Editor or run `supabase db remote commit` with a script.
2. Ensure buckets/storage contain the referenced Unsplash URLs or upload your own media and update the paths.
3. Pair this data with the SQL schema in `../supabase/schema.sql` for a ready-to-demo environment.
