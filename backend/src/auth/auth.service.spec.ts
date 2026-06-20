import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';


jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user and return an access token', async () => {
      const email = 'test@example.com';
      const password = 'plainPassword123';
      const name = 'Test User';
      const hashedPassword = 'hashedPassword123';
      const createdUser = { id: 1, email, name, password: hashedPassword };
      const expectedToken = { access_token: 'fake.jwt.token' };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockPrismaService.user.create.mockResolvedValue(createdUser);
      mockJwtService.sign.mockReturnValue(expectedToken.access_token);

      const result = await service.register(email, password, name);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email, password: hashedPassword, name },
      });
      expect(jwt.sign).toHaveBeenCalledWith({ sub: createdUser.id, email });
      expect(result).toEqual(expectedToken);
    });

    it('should throw ConflictException if email already exists', async () => {
      const email = 'existing@example.com';
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email,
        password: 'someHash',
        name: 'Existing User',
      });

      await expect(
        service.register(email, 'password123', 'Name'),
      ).rejects.toThrow(ConflictException);

      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'plainPassword123';
      const user = { id: 1, email, password: 'hashedPassword123', name: 'Test' };
      const expectedToken = { access_token: 'fake.jwt.token' };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue(expectedToken.access_token);

      const result = await service.login(email, password);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(jwt.sign).toHaveBeenCalledWith({ sub: user.id, email });
      expect(result).toEqual(expectedToken);
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login('nonexistent@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const email = 'test@example.com';
      const user = { id: 1, email, password: 'hashedPassword123', name: 'Test' };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        service.login(email, 'wrongPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});