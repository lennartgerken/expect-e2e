export enum Role {
    VIEWER = 'VIEWER',
    USER = 'USER',
    MANAGER = 'MANAGER'
}

export const users: {
    id: string
    username: string
    password: string
    role: Role
}[] = [
    {
        id: '1',
        username: 'user',
        password: 'password123',
        role: Role.USER
    },
    {
        id: '2',
        username: 'manager',
        password: 'password123',
        role: Role.MANAGER
    },
    {
        id: '3',
        username: 'viewer',
        password: 'password123',
        role: Role.VIEWER
    }
] as const
