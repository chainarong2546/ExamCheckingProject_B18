INSERT INTO public.roles (id, name, detail)
VALUES
  (1, 'Admin', 'Administrator role with full access'),
  (2, 'Teacher', 'Regular user role with limited access');


INSERT INTO public.users (username, password, first_name, last_name, role_id, email)
VALUES
  ('admin1', '$2a$12$TrDww7pmFBciCyCQvV//h.xiHsY6oeu6.bwIbtZesjCeExer1ORQK', 'admin1', 'admin1', 1, 'admin1@example.com'),
  ('teacher1', '$2a$12$TrDww7pmFBciCyCQvV//h.xiHsY6oeu6.bwIbtZesjCeExer1ORQK', 'teacher1', 'teacher1', 2, 'teacher1@example.com');

