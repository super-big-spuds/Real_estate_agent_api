import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
export declare class UsersController {
    private usersService;
    private authService;
    constructor(usersService: UsersService, authService: AuthService);
    getAllUsers(): string;
    register(createUserDto: any): Promise<any>;
    login(loginDto: any): Promise<{
        access_token: string;
    }>;
    deleteUser(userId: number): Promise<any>;
    updateUser(userId: number, updateData: any): Promise<any>;
}
