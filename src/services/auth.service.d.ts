export declare const hashPassword: (pw: string) => Promise<string>;
export declare const comparePassword: (pw: string, hash: string) => Promise<boolean>;
export declare const generateTokens: (adminId: string) => {
    accessToken: string;
    refreshToken: string;
};
export declare const verifyRefreshToken: (token: string) => {
    id: string;
    role: string;
};
export declare const login: (email: string, password: string) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        role: string;
    };
}>;
//# sourceMappingURL=auth.service.d.ts.map