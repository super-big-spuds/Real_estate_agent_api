import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const request = context.switchToHttp().getRequest();
    console.log('User:', request.user); // 输出用户信息
    const isAdmin = request.user && request.user.isadmin;
    console.log('Is Admin:', isAdmin); // 输出是否为管理员
    return request.user && request.user.isadmin;
  }
}
