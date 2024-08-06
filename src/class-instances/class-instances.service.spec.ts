import { Test, TestingModule } from '@nestjs/testing';
import { ClassInstancesService } from './class-instances.service';

describe('ClassSchedulesService', () => {
  let service: ClassInstancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassInstancesService],
    }).compile();

    service = module.get<ClassInstancesService>(ClassInstancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
