type resAxios<T = unknown> = {
    success: boolean;
    msg?: string;
    error?: string;
    data?: T;
};

type loginData_Axios = {
    uuid: string;
    username: string;
    password: string;
    email: string;
    role: number;
};
