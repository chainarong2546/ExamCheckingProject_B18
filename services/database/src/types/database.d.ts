type Answer = {
    ID: number;
    Name: string;
    Owner: string;
    Subject: string;
    Year: number;
    TotalNo: number;
    Answer: Record<string, any>[];
    Archive?: boolean | null;
    CreateAt?: Date | string | null;
    UpdateAt?: Date | string | null;
    User: User;
    AnswerEditLog_AnswerEditLog_AnswerToAnswer: AnswerEditLog[];
    Group_Group_AnswerToAnswer: Group[];
    ShareAnswer?: ShareAnswer | null;
};

type AnswerEditLog = {
    LogID: number;
    By: string;
    Answer: number;
    Detail: Record<string, any>;
    EditAt?: Date | string | null;
    Answer_AnswerEditLog_AnswerToAnswer: Answer;
    User: User;
};

type Group = {
    ID: number;
    Name: string;
    Subject: string;
    Year: number;
    Owner: string;
    Template: number;
    Answer: number;
    Archive?: boolean | null;
    CreateAt?: Date | string | null;
    UpdateAt?: Date | string | null;
    Answer_Group_AnswerToAnswer: Answer;
    User: User;
    Template_Group_TemplateToTemplate: Template;
    GroupEditLog_GroupEditLog_GroupToGroup: GroupEditLog[];
    Sheet_Sheet_GroupToGroup: Sheet[];
};

type GroupEditLog = {
    LogID: number;
    By: string;
    Group: number;
    Detail: Record<string, any>;
    EditAt?: Date | string | null;
    User: User;
    Group_GroupEditLog_GroupToGroup: Group;
};

type LoginLog = {
    LogID: number;
    IPAddress: string;
    Username: number;
    Success: Record<string, any>;
    UUID?: string | null;
    LoginAt?: Date | string | null;
    User?: User | null;
};

type Role = {
    ID: number;
    Name: string;
    Detail?: string | null;
    CreateAt?: Date | string | null;
    UpdateAt?: Date | string | null;
    User_User_RoleToRole: User[];
};

type ShareAnswer = {
    ID: number;
    Code: string;
    CreateAt?: Date | string | null;
    Answer: Answer;
};

type Sheet = {
    ID: number;
    Name: string;
    Group: number;
    Deleted?: boolean | null;
    UpdateAt?: Date | string | null;
    Group_Sheet_GroupToGroup: Group;
    SheetEditLog_SheetEditLog_SheetToSheet: SheetEditLog[];
};

type SheetEditLog = {
    LogID: number;
    By: string;
    Sheet: number;
    Detail: Record<string, any>;
    EditAt?: Date | string | null;
    User: User;
    Sheet_SheetEditLog_SheetToSheet: Sheet;
};

type SheetPredict = {
    Sheet: number;
    Template: number;
    Answer: number;
    Result: Record<string, any>[];
    ResultProbability: Record<string, any>[];
    StdIDResult: Record<string, any>[];
    StdIDResultProbability: Record<string, any>[];
    PredictAt?: Date | string | null;
    Unuse?: Date | string | null;
};

type Template = {
    ID: number;
    Name: string;
    TotalNo: number;
    MarkSymbol_TL: Record<string, any>;
    MarkSymbol_TC: Record<string, any>;
    MarkSymbol_TR: Record<string, any>;
    MarkSymbol_BL: Record<string, any>;
    MarkSymbol_BR: Record<string, any>;
    SquareStdID: Record<string, any>[];
    SquareAnswer: Record<string, any>[];
    Archive?: boolean | null;
    CreateAt?: Date | string | null;
    UpdateAt?: Date | string | null;
    Group_Group_TemplateToTemplate: Group[];
    TemplateEditLog_TemplateEditLog_TemplateToTemplate: TemplateEditLog[];
};

type TemplateEditLog = {
    LogID: number;
    By: string;
    Template: number;
    Detail: Record<string, any>;
    EditAt?: Date | string | null;
    User: User;
    Template_TemplateEditLog_TemplateToTemplate: Template;
};

type User = {
    ID: string;
    Username: string;
    Password: string;
    Firstname: string;
    Lastname: string;
    Role: number;
    Email: string;
    Deleted?: boolean | null;
    RequireChangePassword?: boolean | null;
    CreateAt?: Date | string | null;
    UpdateAt?: Date | string | null;
    Answer: Answer[];
    AnswerEditLog: AnswerEditLog[];
    Group: Group[];
    GroupEditLog: GroupEditLog[];
    LoginLog: LoginLog[];
    SheetEditLog: SheetEditLog[];
    TemplateEditLog: TemplateEditLog[];
    Role_User_RoleToRole: Role;
    UserEditLog_UserEditLog_ByToUser: UserEditLog[];
    UserEditLog_UserEditLog_UserToUser: UserEditLog[];
};

type UserEditLog = {
    LogID: number;
    By: string;
    User: string;
    Detail: Record<string, any>;
    EditAt?: Date | string | null;
    User_UserEditLog_ByToUser: User;
    User_UserEditLog_UserToUser: User;
};
