import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('UploadController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/upload (POST) - upload a file', () => {
        return request(app.getHttpServer())
            .post('/upload')
            .attach('file', __dirname + '/123.jpg') // 使用正确的文件路径
            .expect(201)
            .expect(response => {
                expect(response.body).toHaveProperty('message', 'Successfully upload the image');
                expect(response.body.data).toHaveProperty('url');
                // 检查 URL 是否符合预期格式
                expect(response.body.data.url).toMatch(/http:\/\/localhost:3000\/public\//);
                console.log(response.body.data.url);
            });
    });


    afterAll(async () => {
        await app.close();
    });
});
