INSERT INTO public."Role" ("Name", "Detail")
VALUES
  ('Admin', 'Administrator role with full access'),
  ('Teacher', 'Regular user role with limited access');



INSERT INTO public."User" ("Username", "Password", "FirstName", "LastName", "Role", "Email")
VALUES
  ('admin1', '$2b$16$TI9xA/ArFbqMR/Rf.gWyLOZUmShv8l18Oe2jiYAm6dzCShTMgLaB6', 'Chainarong', 'Kongpol', 1, 'admin@example.com'),
  ('teacher1', '$2b$16$TI9xA/ArFbqMR/Rf.gWyLOZUmShv8l18Oe2jiYAm6dzCShTMgLaB6', 'test', 'test', 2, 'teacher@example.com');
