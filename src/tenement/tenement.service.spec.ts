import { Test, TestingModule } from '@nestjs/testing';
import { TenementService } from './tenement.service';

describe('TenementService', () => {
  let service: TenementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenementService],
    }).compile();

    service = module.get<TenementService>(TenementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
