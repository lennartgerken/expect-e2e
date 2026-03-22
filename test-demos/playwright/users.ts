import { users as baseUsers, Role } from '@lib/users'
export { Role } from '@lib/users'

const findUser = (role: Role) => {
    const user = baseUsers.find((u) => u.role === role)
    if (!user) {
        throw new Error(`User with role ${role} not found`)
    }
    return user
}

export const users = {
    user: findUser(Role.USER)!,
    manager: findUser(Role.MANAGER)!,
    viewer: findUser(Role.VIEWER)!
}
