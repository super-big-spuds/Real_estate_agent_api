import { PrismaService } from '../../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(createUserDto: {
        user_name: string;
        user_email: string;
        user_password: string;
    }): Promise<any>;
    findOneByEmail(email: string): Promise<any>;
    deleteUser(userId: number): Promise<any>;
    getHello(): string;
    updateUser(userId: number, updateData: any): Promise<any>;
}
