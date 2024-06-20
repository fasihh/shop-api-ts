import User from '../models/user';

class UserDAO {
    // find user by id
    async getById(id: number): Promise<User | null> {
        const user: User | null = await User.findOne({ where: { id } });
        return user;
    }

    // find user by name
    async getByName(username: string): Promise<User | null> {
        const user: User | null = await User.findOne({ where: { username } });
        return user;
    }

    // get all users
    async getAll(): Promise<User[]> {
        const users: User[] = await User.findAll();
        return users;
    }

    // create a user record
    async create(username: string, password: string): Promise<void> {
        await User.create({
            username,
            password
        });
    }

    // update user by id
    async update(id: number | undefined, username: string | undefined, password: string | undefined): Promise<void> {
        await User.update({
            username,
            password
        }, { where: { id } });
    }
}

const UserDAOInst = new UserDAO;

export default UserDAOInst;
