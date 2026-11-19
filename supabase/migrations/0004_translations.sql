-- Kolom terjemahan opsional (Inggris & Arab). Kosong = tampilkan versi Indonesia.
do $$
declare
  spec record;
  col text;
  lang text;
begin
  for spec in
    select * from (values
      ('posts', array['title', 'excerpt', 'body']),
      ('programs', array['title', 'region', 'summary', 'body']),
      ('dpln_chapters', array['country', 'city', 'note']),
      ('donation_channels', array['label', 'detail']),
      ('partners', array['name', 'country']),
      ('slides', array['title']),
      ('stats', array['label'])
    ) as t(tbl, cols)
  loop
    foreach col in array spec.cols loop
      foreach lang in array array['en', 'ar'] loop
        execute format('alter table %I add column %I text not null default %L', spec.tbl, col || '_' || lang, '');
      end loop;
    end loop;
  end loop;
end $$;
