import { Test, TestingModule } from '@nestjs/testing';
import { TenementController } from './tenement.controller';

describe('TenementController', () => {
  let controller: TenementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenementController],
    }).compile();

    controller = module.get<TenementController>(TenementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
