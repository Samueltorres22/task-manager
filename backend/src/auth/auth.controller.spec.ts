import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with body data and return the result', async () => {
      const body = { email: 'test@example.com', password: 'pass123', name: 'Test User' };
      const expectedResult = { access_token: 'fake.jwt.token' };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(body);

      expect(authService.register).toHaveBeenCalledWith(
        body.email,
        body.password,
        body.name,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should call authService.login with body data and return the result', async () => {
      const body = { email: 'test@example.com', password: 'pass123' };
      const expectedResult = { access_token: 'fake.jwt.token' };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(body);

      expect(authService.login).toHaveBeenCalledWith(body.email, body.password);
      expect(result).toEqual(expectedResult);
    });
  });
});