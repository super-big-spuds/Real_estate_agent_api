import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { collection_notice } from '@prisma/client';
describe('CollectionController (e2e)', () => {
    let app: INestApplication;
    let testCollectionNoticeID: collection_notice
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/collections (POST) - Create collection', () => {
        return request(app.getHttpServer())
            .post('/collections')
            .send({
                "tenement_id": "1",
                "collection_name": "水费",
                "collection_type": "代收",
                "price": 500,
                "payment": "银行转账",
                "collection_remark": "12月份水费",
                "remittance_bank": "DEF Bank",
                "remittance_account": "9876543210",
                "isDelete": false
            })
            .expect(201)
            .expect(response => {
                expect(response.body).toHaveProperty('message', 'Successfully created the collection');
                expect(response.body).toHaveProperty('data');
            });
    });

    it('/collections (PUT) - Update collection', () => {
        return request(app.getHttpServer())
            .put('/collections')
            .send({
                "collection_id": 1,
                "tenements_id": "1",
                "type": "代付",
                "collection_name": "租金",
                "price": 1000,
                "payment": "现金",
                "collection_remark": "11月份租金",
                "remittance_bank": "ABC Bank",
                "remittance_account": "1234567890"
            })
            .expect(200)
            .expect(response => {
                expect(response.body).toHaveProperty('message', 'Successfully updated the collection');
                expect(response.body).toHaveProperty('data');
            });
    });

    it('/collections (GET) - Get collections', () => {
        return request(app.getHttpServer())
            .get('/collections')
            .query({
                tenement_id: 1,
                collection_name: "租金",
            })
            .expect(200)
            .expect(response => {
                expect(response.body).toHaveProperty('data');
            });
    });

    it('/collections/:id (GET) - Get collection by ID', () => {
        const collectionId = 1; // 假設的 collection ID
        return request(app.getHttpServer())
            .get(`/collections/${collectionId}`)
            .expect(200)
            .expect(response => {
                expect(response.body);
            });
    });



    it('/collection-notices (POST) - Create collection notice', async () => {
        const response = await request(app.getHttpServer())
            .post('/collection-notices')
            .send({
                collection_id: 1,
                collection_remind: "Record details",
                collection_record: "Reminder details",
                visitDate: new Date(),
                remindDate: new Date(),
            })
            .expect(201);
        testCollectionNoticeID = response.body.data.notice_id;
        expect(response.body)
    });

    it('/collection-notices/:id (PUT) - Update collection notice', () => {
        return request(app.getHttpServer())
            .put(`/collection-notices/${testCollectionNoticeID}`)
            .send({
                visitDate: new Date(),
                collection_record: "Reminder details123",
                remindDate: new Date(),
                collection_remind: "Record details1223",
            })
            .expect(200)
            .expect(response => {
                expect(response.body).toHaveProperty('message', 'Successfully updated the notice data');
                expect(response.body).toHaveProperty('data');
            });
    });

    it('/collection-notices/:id (DELETE) - Delete collection notice', () => {
        return request(app.getHttpServer())
            .delete(`/collection-notices/${testCollectionNoticeID}`)
            .expect(200)
            .expect(response => {
                expect(response.body).toHaveProperty('message', 'Successfully delete the notice data');
            });
    });


    it('/collections (DELETE) - Delete collection', () => {
        return request(app.getHttpServer())
            .delete('/collections')
            .send({
                "tenement_id": 1,
                "collection_id": 1
            })
            .expect(200)
            .expect(response => {
                expect(response.body).toHaveProperty('message', 'Successfully Deleted the collection');
                expect(response.body).toHaveProperty('data');
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
