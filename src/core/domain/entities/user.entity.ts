export type UserProps = {
    id?: number;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
    role?: string;
}

export class User {
    constructor(
        private readonly props: UserProps,
    ) {
        this.props.createdAt = this.props.createdAt ?? new Date();
        this.props.updatedAt = this.props.updatedAt ?? new Date();
    }

    updateUser(name: string, email: string) {
        this.props.name = name;
        this.props.email = email;
    }

    setLastLoginAt(date: Date) {
        this.props.lastLogin = date;
    }

    get id(): number | undefined {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get email(): string {
        return this.props.email;
    }

    get password(): string {
        return this.props.password;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    get updatedAt(): Date | undefined {
        return this.props.updatedAt;
    }

    get lastLogin(): Date | undefined {
        return this.props.lastLogin;
    }

    get role(): string | undefined {
        return this.props.role;
    }
}