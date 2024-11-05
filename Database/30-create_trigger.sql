--------------------------------------------------------------------------
---------------------- Trigger and Trigger Functions ---------------------

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();


CREATE TRIGGER update_templates_modtime
    BEFORE UPDATE ON public.templates
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();


CREATE TRIGGER update_answers_modtime
    BEFORE UPDATE ON public.answers
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();


CREATE TRIGGER update_groups_modtime
    BEFORE UPDATE ON public.groups
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();


CREATE TRIGGER update_sheets_modtime
    BEFORE UPDATE ON public.sheets
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
