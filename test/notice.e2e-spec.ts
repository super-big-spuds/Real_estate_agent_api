import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('NoticesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/notices/:year/:month (GET) - Get notices by year and month', () => {
    const year = 2024;
    const month = 1;
    return request(app.getHttpServer())
      .get(`/notices/${year}/${month}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveProperty('message', '成功取得資料');
        expect(response.body).toHaveProperty('data');
        // 使用 JSON.stringify 來打印完整的數據
        console.log(
          'Response Data:',
          JSON.stringify(response.body.data, null, 2),
        );
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
