insert into public.bakers (id, name, business_name, description, rating, delivery_radius_km, min_lead_time_hours, avatar_url, hero_image_url, location, specialties, is_verified)
values
  ('baker-luna', 'Luna Kariuki', 'Luna''s Artisan Cakes', 'Nairobi-based pastry chef specializing in modern buttercream finishes and East African flavor twists.', 4.9, 20, 6, 'https://images.unsplash.com/photo-1541971875078-7c0dbb4f87de', 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40', '{"latitude":-1.28333,"longitude":36.81667,"addressLine1":"19 Riverside Drive","city":"Nairobi","country":"Kenya"}', '{"buttercream","wedding","vegan"}', true),
  ('baker-ivy', 'Ivy Moyo', 'Ivy''s Cake Lab', 'Vegan and gluten-free masterpieces with seasonal fruits and edible florals.', 4.7, 15, 12, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e', '{"latitude":-26.2041,"longitude":28.0473,"addressLine1":"44 Fox Street","city":"Johannesburg","country":"South Africa"}', '{"vegan","gluten-free","cupcakes"}', true),
  ('baker-yara', 'Yara Benali', 'Casablanca Confections', 'Moroccan-inspired pastries with saffron, rose, and pistachio infusions.', 4.8, 25, 8, 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39', 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38', '{"latitude":33.5731,"longitude":-7.5898,"addressLine1":"12 Rue Taha Hussein","city":"Casablanca","country":"Morocco"}', '{"fusion","mini cakes","tea cakes"}', true),
  ('baker-emi', 'Emi Nakamoto', 'Tokyo Flour Studio', 'Minimal Japanese chiffon cakes with matcha, yuzu, and black sesame twists.', 4.95, 18, 10, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', '{"latitude":35.6762,"longitude":139.6503,"addressLine1":"2-11-5 Shibuya","city":"Tokyo","country":"Japan"}', '{"minimal","matcha","custom"}', true),
  ('baker-sasha', 'Sasha Mensah', 'Accra Cake Collective', 'Bold Ghanaian flavors with plantain caramel, hibiscus, and coconut praline.', 4.6, 22, 9, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1', 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17', '{"latitude":5.6037,"longitude":-0.187,"addressLine1":"88 Labadi Road","city":"Accra","country":"Ghana"}', '{"celebration","3D cakes","local flavors"}', true)
on conflict (id) do update set
  name = excluded.name,
  business_name = excluded.business_name,
  description = excluded.description;

insert into public.cakes (id, baker_id, title, description, price, currency, photo_url, prep_time_minutes, tags, is_featured)
values
  ('cake-luna-velvet','baker-luna','Guava Velvet','Three-layer velvet cake infused with guava puree and mascarpone buttercream.',65,'USD','https://images.unsplash.com/photo-1495147466023-ac5c588e2e94',240,'{"signature","fruit"}',true),
  ('cake-luna-safari','baker-luna','Safari Caramel Crunch','Salted caramel sponge with roasted macadamia praline shards.',54,'USD','https://images.unsplash.com/photo-1478145046317-39f10e56b5e9',180,'{"caramel","popular"}',true),
  ('cake-ivy-rose','baker-ivy','Rose Quartz','Vegan vanilla bean sponge, rose cashew cream, and pressed florals.',58,'USD','https://images.unsplash.com/photo-1464349379623-0c2f58c1a4a0',200,'{"vegan","gluten-free"}',true),
  ('cake-ivy-midnight','baker-ivy','Midnight Cacao','Single-origin chocolate, espresso soak, and coconut whip.',62,'USD','https://images.unsplash.com/photo-1504674900247-0877df9cc836',210,'{"chocolate","espresso"}',false),
  ('cake-yara-saffron','baker-yara','Saffron Pistache','Almond semolina sponge soaked in orange blossom syrup.',70,'USD','https://images.unsplash.com/photo-1499028344343-cd173ffc68a9',260,'{"saffron","pistachio"}',true),
  ('cake-yara-cedar','baker-yara','Atlas Cedar','Honey yogurt cake with cedar-smoked caramel.',55,'USD','https://images.unsplash.com/photo-1466978913421-dad2ebd01d17',190,'{"honey","aromatic"}',false),
  ('cake-emi-matcha','baker-emi','Matcha Silk','Airy chiffon layers with ceremonial-grade matcha cream.',68,'USD','https://images.unsplash.com/photo-1499636136210-6f4ee915583e',230,'{"matcha","chiffon"}',true),
  ('cake-emi-yuzu','baker-emi','Yuzu Cloud','Citrus mousse domes with sable base and shiso crumble.',72,'USD','https://images.unsplash.com/photo-1486427944299-d1955d23e34d',300,'{"yuzu","mousse"}',true),
  ('cake-sasha-plantain','baker-sasha','Plantain Toffee','Plantain caramel cake with coconut praline crunch.',52,'USD','https://images.unsplash.com/photo-1497051788611-2c64812349a5',180,'{"plantain","caramel"}',true),
  ('cake-sasha-hibiscus','baker-sasha','Hibiscus Sunset','Vanilla sponge with hibiscus gelée and coconut meringue.',57,'USD','https://images.unsplash.com/photo-1470337458703-46ad1756a187',210,'{"hibiscus","tropical"}',false)
on conflict (id) do update set
  title = excluded.title,
  price = excluded.price;
