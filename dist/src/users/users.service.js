"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.user_password, 10);
        return this.prisma.user.create({
            data: {
                user_name: createUserDto.user_name,
                user_email: createUserDto.user_email,
                user_password: hashedPassword,
                status: true,
            },
        });
    }
    async findOneByEmail(email) {
        return this.prisma.user.findUnique({
            where: {
                user_email: email,
            },
        });
    }
    async deleteUser(userId) {
        return this.prisma.user.delete({
            where: {
                user_id: userId,
            },
        });
    }
    getHello() {
        return 'Hello World!';
    }
    async updateUser(userId, updateData) {
        if (updateData.user_password) {
            updateData.user_password = await bcrypt.hash(updateData.user_password, 10);
        }
        return this.prisma.user.update({
            where: {
                user_id: userId,
            },
            data: updateData,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map