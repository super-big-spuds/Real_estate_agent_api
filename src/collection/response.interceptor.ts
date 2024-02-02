import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    let message = 'Success';

    switch (request.method) {
      case 'POST':
        message = 'Successfully create data';
        break;
      case 'PUT':
        message = 'Successfully update data';
        break;
      case 'DELETE':
        message = 'Successfully delete data';
        break;
      case 'DELETE':
        message = 'Successfully get data';
        break;
    }

    return next.handle().pipe(
      map((data) => ({
        message: message,
        data: data,
      })),
    );
  }
}
