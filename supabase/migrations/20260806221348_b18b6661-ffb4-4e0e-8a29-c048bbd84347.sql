CREATE OR REPLACE FUNCTION public.enforce_publish_permission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;
  IF public.has_role(auth.uid(),'admin') THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.published := false;
  ELSE
    NEW.published := OLD.published;
  END IF;
  RETURN NEW;
END; $function$;