-- تعيين مالك الموقع الرسمي وحماية صلاحية الإدارة الخاصة به.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = 'amgdkeit@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
  OR (
    _role = 'admin'::public.app_role
    AND EXISTS (
      SELECT 1
      FROM auth.users
      WHERE id = _user_id AND lower(email) = 'amgdkeit@gmail.com'
    )
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

COMMENT ON FUNCTION public.has_role(uuid, public.app_role) IS
  'Role check with protected site owner account amgdkeit@gmail.com.';

-- تأكد من وجود الملف التعريفي للحساب إن كان الحساب موجودًا مسبقًا.
INSERT INTO public.profiles (id, email)
SELECT id, email
FROM auth.users
WHERE lower(email) = 'amgdkeit@gmail.com'
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner read own profile" ON public.profiles;
CREATE POLICY "owner read own profile" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "staff read profiles" ON public.profiles;
CREATE POLICY "staff read profiles" ON public.profiles FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    OR public.has_role(auth.uid(),'editor')
    OR public.has_role(auth.uid(),'viewer')
  );

DROP POLICY IF EXISTS "owner update own profile" ON public.profiles;
CREATE POLICY "owner update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "admins delete roles" ON public.user_roles;
CREATE POLICY "admins delete roles" ON public.user_roles FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    AND NOT (
      user_id IN (SELECT id FROM auth.users WHERE lower(email) = 'amgdkeit@gmail.com')
      AND role = 'admin'::public.app_role
    )
  );

GRANT DELETE ON public.user_roles TO authenticated;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.user_roles IS
  'Roles for Magrm staff; amgdkeit@gmail.com is the protected site owner.';

-- يمكن تشغيل هذه الترقية بأمان أكثر من مرة بفضل ON CONFLICT و DROP POLICY IF EXISTS.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = 'amgdkeit@gmail.com') THEN
    RAISE NOTICE 'Site owner account amgdkeit@gmail.com is configured.';
  ELSE
    RAISE NOTICE 'Site owner email configured; role will apply when the account exists.';
  END IF;
END
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
