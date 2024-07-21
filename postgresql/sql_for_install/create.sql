--------------------------------------------------------------------------
--------------------------- Table and Sequence ---------------------------

CREATE SEQUENCE public."Role_ID_serial" AS SMALLINT;
CREATE TABLE public."Role" (
    "ID" SMALLINT DEFAULT nextval('public."Role_ID_serial"'),
    "Name" CHARACTER VARYING(100) NOT NULL,
    "Detail" TEXT,
    "CreateAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Role_primary" PRIMARY KEY ("ID"),
    CONSTRAINT "Role_Name_unique" UNIQUE ("Name")
);
ALTER SEQUENCE public."Role_ID_serial" OWNED BY public."Role"."ID";


CREATE TABLE public."User" (
    "ID" UUID DEFAULT gen_random_uuid(),
    "Username" CHARACTER VARYING(100) NOT NULL,
    "Password" CHARACTER VARYING(255) NOT NULL,
    "FirstName" CHARACTER VARYING(100) NOT NULL,
    "LastName" CHARACTER VARYING(100) NOT NULL,
    "Role" SMALLINT NOT NULL,
    "Email" CHARACTER VARYING(255) NOT NULL,
    "Deleted" BOOLEAN DEFAULT FALSE,
    "RequireChangePassword" BOOLEAN DEFAULT TRUE,
    "CreateAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_primary" PRIMARY KEY ("ID"),
    CONSTRAINT "User_Username_unique" UNIQUE ("Username"),
    CONSTRAINT "User_Email_unique" UNIQUE ("Email"),
    CONSTRAINT "User_Role_foreign_Role_ID" FOREIGN KEY ("Role") REFERENCES public."Role" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT
);


CREATE SEQUENCE public."Template_ID_serial" AS SMALLINT;
CREATE TABLE public."Template" (
    "ID" SMALLINT DEFAULT nextval('public."Template_ID_serial"'),
    "Name" CHARACTER VARYING(255) NOT NULL,
    "TotalNo" SMALLINT NOT NULL,
    "MarkSymbol_TL" JSONB NOT NULL, -- {"sx": 100, "sy": 200, "ex": 300, "ey": 400}
    "MarkSymbol_TC" JSONB NOT NULL,
    "MarkSymbol_TR" JSONB NOT NULL,
    "MarkSymbol_BL" JSONB NOT NULL,
    "MarkSymbol_BR" JSONB NOT NULL,
    "SquareStdID" JSONB[] NOT NULL, -- [{"sx": 100, "sy": 200, "ex": 300, "ey": 400}, {"sx": 100, "sy": 200, "ex": 300, "ey": 400}]
    "SquareAnswer" JSONB[] NOT NULL, -- [{"sx": 100, "sy": 200, "ex": 300, "ey": 400}, {"sx": 100, "sy": 200, "ex": 300, "ey": 400}]
    "Archive" BOOLEAN DEFAULT FALSE,
    "CreateAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Template_primary" PRIMARY KEY ("ID")
);
ALTER SEQUENCE public."Template_ID_serial" OWNED BY public."Template"."ID";


CREATE SEQUENCE public."Answer_ID_serial" AS INTEGER;
CREATE TABLE public."Answer" (
    "ID" INTEGER DEFAULT nextval('public."Answer_ID_serial"'),
    "Name" CHARACTER VARYING(255) NOT NULL,
    "Owner" UUID NOT NULL,
    "Subject" CHARACTER VARYING(255) NOT NULL,
    "Year" CHARACTER VARYING(10) NOT NULL,
    "TotalNo" SMALLINT NOT NULL,
    "Answer" JSONB[] NOT NULL, -- [{"answer": [1], "point": 1}, {"answer": [2, 3], "point": 1}]
    "Archive" BOOLEAN DEFAULT FALSE,
    "CreateAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Answer_primary" PRIMARY KEY ("ID"),
    CONSTRAINT "Answer_Owner_foreign_User_ID" FOREIGN KEY ("Owner") REFERENCES public."User" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT
);
ALTER SEQUENCE public."Answer_ID_serial" OWNED BY public."Answer"."ID";


CREATE SEQUENCE public."ShareAnswer_ID_serial" AS INTEGER;
CREATE TABLE public."ShareAnswer" (
    "ID" INTEGER NOT NULL,
    "Code" CHARACTER VARYING(20) NOT NULL,
    "CreateAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ShareAnswer_primary" PRIMARY KEY ("ID"),
    CONSTRAINT "ShareAnswer_ID_foreign_Answer_ID" FOREIGN KEY ("ID") REFERENCES public."Answer" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT "ShareAnswer_Code_unique" UNIQUE ("Code")
);
ALTER SEQUENCE public."ShareAnswer_ID_serial" OWNED BY public."ShareAnswer"."ID";


CREATE SEQUENCE public."Group_ID_serial" AS INTEGER;
CREATE TABLE public."Group" (
    "ID" INTEGER DEFAULT nextval('public."Group_ID_serial"'),
    "Name" CHARACTER VARYING(255) NOT NULL,
    "Subject" CHARACTER VARYING(255) NOT NULL,
    "Year" CHARACTER VARYING(10) NOT NULL,
    "Owner" UUID NOT NULL,
    "Template" SMALLINT NOT NULL,
    "Answer" SMALLINT NOT NULL,
    "Archive" BOOLEAN DEFAULT FALSE,
    "CreateAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Group_primary" PRIMARY KEY ("ID"),
    CONSTRAINT "Group_Owner_foreign_User_ID" FOREIGN KEY ("Owner") REFERENCES public."User" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT "Group_Template_foreign_Template_ID" FOREIGN KEY ("Template") REFERENCES public."Template" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT "Group_Answer_foreign_Answer_ID" FOREIGN KEY ("Answer") REFERENCES public."Answer" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT
);
ALTER SEQUENCE public."Group_ID_serial" OWNED BY public."Group"."ID";


CREATE SEQUENCE public."Sheet_ID_serial" AS INTEGER;
CREATE TABLE public."Sheet" (
    "ID" INTEGER DEFAULT nextval('public."Sheet_ID_serial"'),
    "Name" CHARACTER VARYING(100) NOT NULL,
    "Group" INTEGER NOT NULL,
    "Deleted" BOOLEAN DEFAULT FALSE,
    "CreateAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sheet_primary" PRIMARY KEY ("ID"),
    CONSTRAINT "Sheet_Name_unique" UNIQUE ("Name"),
    CONSTRAINT "Sheet_Group_foreign_Group_ID" FOREIGN KEY ("Group") REFERENCES public."Group" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT
);
ALTER SEQUENCE public."Sheet_ID_serial" OWNED BY public."Group"."ID";


CREATE SEQUENCE public."SheetPredict_ID_serial" AS INTEGER;
CREATE TABLE public."SheetPredict" (
    "ID" INTEGER DEFAULT nextval('public."SheetPredict_ID_serial"'),
    "Sheet" INTEGER NOT NULL,
    "Template" SMALLINT NOT NULL,
    "Answer" INTEGER NOT NULL,
    "Result" JSONB[] NOT NULL, -- [{"a": {"type": 1, "percent": 80}, "b": {"type": 0, "percent": 90}}]
    "ResultProbability" JSONB[] NOT NULL, -- [{"a": {"0": 10, "1": 80, "2": 5, "3": 15}, "b": {"a": {"0": 90, "1": 10, "2": 5, "3": 15}]
    "StdIDResult" JSONB[] NOT NULL, -- [{"type": 1, "percent": 80}]
    "StdIDResultProbability" JSONB[] NOT NULL, -- [{"0": 5, "1": 80, "2": 10, "3": 20, ........}] 
    "UnUse" BOOLEAN DEFAULT FALSE,
    "PredictAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SheetPredict_primary" PRIMARY KEY ("ID"),
    CONSTRAINT "SheetPredict_Sheet_foreign_Sheet_ID" FOREIGN KEY ("Sheet") REFERENCES public."Sheet" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT "SheetPredict_Template_foreign_Template_ID" FOREIGN KEY ("Template") REFERENCES public."Template" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT "SheetPredict_Answer_foreign_Answer_ID" FOREIGN KEY ("Answer") REFERENCES public."Answer" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT
);
ALTER SEQUENCE public."SheetPredict_ID_serial" OWNED BY public."Group"."ID";

--------------------------- Log ---------------------------

CREATE SEQUENCE public."AnswerEditLog_LogID_serial" AS BIGINT;
CREATE TABLE public."AnswerEditLog" (
    "LogID" BIGINT DEFAULT nextval('public."AnswerEditLog_LogID_serial"'),
    "By" UUID NOT NULL,
    "Answer" INTEGER NOT NULL,
    "Detail" JSONB NOT NULL,
    "EditAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnswerEditLog_primary" PRIMARY KEY ("LogID"),
    CONSTRAINT "AnswerEditLog_By_foreign_User_ID" FOREIGN KEY ("By") REFERENCES public."User" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT "AnswerEditLog_Answer_foreign_Answer_ID" FOREIGN KEY ("Answer") REFERENCES public."Answer" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT
);
ALTER SEQUENCE public."AnswerEditLog_LogID_serial" OWNED BY public."AnswerEditLog"."LogID";


CREATE SEQUENCE public."TemplateEditLog_LogID_serial" AS BIGINT;
CREATE TABLE public."TemplateEditLog" (
    "LogID" BIGINT DEFAULT nextval('public."TemplateEditLog_LogID_serial"'),
    "By" UUID NOT NULL,
    "Template" SMALLINT NOT NULL,
    "Detail" JSONB NOT NULL,
    "EditAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TemplateEditLog_primary" PRIMARY KEY ("LogID"),
    CONSTRAINT "TemplateEditLog_By_foreign_User_ID" FOREIGN KEY ("By") REFERENCES public."User" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT "TemplateEditLog_Template_foreign_Template_ID" FOREIGN KEY ("Template") REFERENCES public."Template" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT
);
ALTER SEQUENCE public."TemplateEditLog_LogID_serial" OWNED BY public."TemplateEditLog"."LogID";


CREATE SEQUENCE public."GroupEditLog_LogID_serial" AS BIGINT;
CREATE TABLE public."GroupEditLog" (
    "LogID" BIGINT DEFAULT nextval('public."GroupEditLog_LogID_serial"'),
    "By" UUID NOT NULL,
    "Group" INTEGER NOT NULL,
    "Detail" JSONB NOT NULL,
    "EditAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GroupEditLog_primary" PRIMARY KEY ("LogID"),
    CONSTRAINT "GroupEditLog_By_foreign_User_ID" FOREIGN KEY ("By") REFERENCES public."User" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT "GroupEditLog_Group_foreign_Group_ID" FOREIGN KEY ("Group") REFERENCES public."Group" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT
);
ALTER SEQUENCE public."GroupEditLog_LogID_serial" OWNED BY public."GroupEditLog"."LogID";


CREATE SEQUENCE public."SheetPredictEditLog_LogID_serial" AS BIGINT;
CREATE TABLE public."SheetPredictEditLog" (
    "LogID" BIGINT DEFAULT nextval('public."SheetPredictEditLog_LogID_serial"'),
    "By" UUID NOT NULL,
    "SheetPredict" INTEGER NOT NULL,
    "Detail" JSONB NOT NULL,
    "EditAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SheetPredictEditLog_primary" PRIMARY KEY ("LogID"),
    CONSTRAINT "SheetPredictEditLog_By_foreign_User_ID" FOREIGN KEY ("By") REFERENCES public."User" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT "SheetPredictEditLog_Sheet_foreign_Sheet_ID" FOREIGN KEY ("SheetPredict") REFERENCES public."SheetPredict" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT
);
ALTER SEQUENCE public."SheetPredictEditLog_LogID_serial" OWNED BY public."SheetPredictEditLog"."LogID";


CREATE SEQUENCE public."UserEditLog_LogID_serial" AS BIGINT;
CREATE TABLE public."UserEditLog" (
    "LogID" BIGINT DEFAULT nextval('public."UserEditLog_LogID_serial"'),
    "By" UUID NOT NULL,
    "User" UUID NOT NULL,
    "Detail" JSONB NOT NULL,
    "EditAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserEditLog_primary" PRIMARY KEY ("LogID"),
    CONSTRAINT "UserEditLog_By_foreign_User_ID" FOREIGN KEY ("By") REFERENCES public."User" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT "UserEditLog_User_foreign_User_ID" FOREIGN KEY ("User") REFERENCES public."User" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT
);
ALTER SEQUENCE public."UserEditLog_LogID_serial" OWNED BY public."UserEditLog"."LogID";


CREATE SEQUENCE public."LoginLog_LogID_serial" AS BIGINT;
CREATE TABLE public."LoginLog" (
    "LogID" BIGINT DEFAULT nextval('public."LoginLog_LogID_serial"'),
    "IPAddress" CHARACTER VARYING(100) NOT NULL,
    "Username" CHARACTER VARYING(100) NOT NULL,
    "Success" BOOLEAN NOT NULL,
    "UUID" UUID,
    "LoginAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LoginLog_primary" PRIMARY KEY ("LogID"),
    CONSTRAINT "LoginLog_UUID_foreign_User_ID" FOREIGN KEY ("UUID") REFERENCES public."User" ("ID") ON UPDATE RESTRICT ON DELETE RESTRICT
);
ALTER SEQUENCE public."LoginLog_LogID_serial" OWNED BY public."LoginLog"."LogID";



--------------------------- Report ---------------------------

-- TODO



--------------------------------------------------------------------------
---------------------- Trigger and Trigger Functions ---------------------

CREATE FUNCTION public."AutoUpdate_UpdateAt"()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    NEW."UpdateAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$BODY$;


CREATE TRIGGER "Role_AutoUpdate_UpdateAt"
    BEFORE UPDATE 
    ON public."Role"
    FOR EACH ROW
    EXECUTE FUNCTION public."AutoUpdate_UpdateAt"();


CREATE TRIGGER "User_AutoUpdate_UpdateAt"
    BEFORE UPDATE 
    ON public."User"
    FOR EACH ROW
    EXECUTE FUNCTION public."AutoUpdate_UpdateAt"();

    
CREATE TRIGGER "Template_AutoUpdate_UpdateAt"
    BEFORE UPDATE 
    ON public."Template"
    FOR EACH ROW
    EXECUTE FUNCTION public."AutoUpdate_UpdateAt"();

    
CREATE TRIGGER "Answer_AutoUpdate_UpdateAt"
    BEFORE UPDATE 
    ON public."Answer"
    FOR EACH ROW
    EXECUTE FUNCTION public."AutoUpdate_UpdateAt"();


CREATE TRIGGER "Group_AutoUpdate_UpdateAt"
    BEFORE UPDATE 
    ON public."Group"
    FOR EACH ROW
    EXECUTE FUNCTION public."AutoUpdate_UpdateAt"();


CREATE TRIGGER "Sheet_AutoUpdate_UpdateAt"
    BEFORE UPDATE 
    ON public."Sheet"
    FOR EACH ROW
    EXECUTE FUNCTION public."AutoUpdate_UpdateAt"();
    