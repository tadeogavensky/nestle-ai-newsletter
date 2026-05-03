import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';

describe('AssetsController', () => {
  let controller: AssetsController;
  const assetsService = {
    uploadAssets: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetsController],
      providers: [
        {
          provide: AssetsService,
          useValue: assetsService,
        },
      ],
    }).compile();

    controller = module.get<AssetsController>(AssetsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('rejects asset uploads without bearer authentication', () => {
    expect(() => controller.uploadAssets(undefined, 'IMAGE', [])).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects asset listing without bearer authentication', () => {
    expect(() => controller.listAssets(undefined)).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects asset uploads with invalid asset type', () => {
    expect(() =>
      controller.uploadAssets('Bearer token', 'NOT_VALID', []),
    ).toThrow(BadRequestException);
  });

  it('rejects asset listing with invalid asset type', () => {
    expect(() => controller.listAssets('Bearer token', 'NOT_VALID')).toThrow(
      BadRequestException,
    );
  });
});
