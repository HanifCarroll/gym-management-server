import { Test, TestingModule } from '@nestjs/testing';
import { ClassInstancesController } from './class-instances.controller';

describe('ClassSchedulesController', () => {
  let controller: ClassInstancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassInstancesController],
    }).compile();

    controller = module.get<ClassInstancesController>(ClassInstancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
