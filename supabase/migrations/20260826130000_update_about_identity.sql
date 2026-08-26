-- تحديث هوية قسم «عني» بالاسم والعبارة المعتمدة من مالك الموقع.
INSERT INTO public.site_settings (id, data)
VALUES (
  'main',
  jsonb_build_object(
    'aboutName', 'Mohammed Al-Azzani',
    'aboutIntro', 'هنا يبدأ الحضور الذي لا يكتفي بملاحقة الخطر؛ بل يقرأه قبل أن يصل، ويحوّل المعرفة إلى قوة، والانضباط إلى حماية، والطموح إلى أثرٍ يفرض احترامه في عالم الأمن السيبراني.'
  )
)
ON CONFLICT (id) DO UPDATE SET
  data = COALESCE(public.site_settings.data, '{}'::jsonb) || EXCLUDED.data;
