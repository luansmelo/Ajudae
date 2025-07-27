export const REPOSITORY_TOKENS = {
    USER_REPOSITORY: Symbol('USER_REPOSITORY'),
    SESSION_REPOSITORY: Symbol('SESSION_REPOSITORY'),
} as const;

export type RepositoryToken = (typeof REPOSITORY_TOKENS)[keyof typeof REPOSITORY_TOKENS];

export const SERVICE_TOKENS = {
    PASSWORD_ENCRYPTOR: Symbol('PASSWORD_ENCRYPTOR'),
} as const;

export type ServiceToken = (typeof SERVICE_TOKENS)[keyof typeof SERVICE_TOKENS];