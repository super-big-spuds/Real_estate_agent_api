import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('Users e2e test', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users/register (POST)', async () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        user_name: 'testuser',
        user_email: 'test@example.com',
        user_password: 'password123',
        status: true,
        isadmin: true,
      })
      .expect(201); // 假设注册成功返回状态码是 201
  });

  it('/users/login (POST)', async () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send({
        user_email: 'test@example.com',
        user_password: 'password123',
      })
      .expect(201) // 假设登录成功返回状态码是 201
      .then(response => {
        expect(response.body).toHaveProperty('access_token');
        jwtToken = response.body.access_token;
        console.log('JWT Token:', jwtToken);
      });
  });

  it('/users/:id (PUT)', async () => {
    return request(app.getHttpServer())
      .put('/users/16') // 假设要更新的用户 ID 是 1
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        user_name: 'updatedName',
      })
      .expect(200); // 假设更新成功返回状态码是 200
  });

  it('/users/:id (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete('/users/16') // 假设要删除的用户 ID 是 1
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200); // 假设删除成功返回状态码是 200
  });

  afterAll(async () => {
    await app.close();
  });
});
