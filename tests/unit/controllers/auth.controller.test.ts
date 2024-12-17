import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { registerController, loginController, logoutController } from '../../../src/controllers/auth.controller';
import * as authService from '../../../src/services/auth.service';

// Mock the auth service
vi.mock('../../../src/services/auth.service');

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: ReturnType<typeof vi.fn>;
  let mockStatus: ReturnType<typeof vi.fn>;
  let mockCookie: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockJson = vi.fn();
    mockStatus = vi.fn().mockReturnValue({ json: mockJson });
    mockCookie = vi.fn();
    
    mockRequest = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };
    
    mockResponse = {
      status: mockStatus,
      cookie: mockCookie,
      json: mockJson
    };
  });

  describe('registerController', () => {
    it('should successfully register a user', async () => {
      const mockRegisterResult = {
        token: 'mock-token',
        user: { id: 1, email: 'test@example.com' }
      };

      vi.spyOn(authService, 'register').mockResolvedValue(mockRegisterResult);

      await registerController(mockRequest as Request, mockResponse as Response);

      expect(authService.register).toHaveBeenCalledWith(mockRequest.body);
      expect(mockCookie).toHaveBeenCalledWith(
        'token',
        mockRegisterResult.token,
        expect.any(Object)
      );
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockRegisterResult,
        message: 'Registration successful'
      });
    });

    it('should handle registration errors', async () => {
      const errorMessage = 'Registration failed';
      vi.spyOn(authService, 'register').mockRejectedValue(new Error(errorMessage));

      await registerController(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('loginController', () => {
    it('should successfully log in a user', async () => {
      const mockLoginResult = {
        token: 'mock-token',
        user: { id: 1, email: 'test@example.com' }
      };

      vi.spyOn(authService, 'login').mockResolvedValue(mockLoginResult);

      await loginController(mockRequest as Request, mockResponse as Response);

      expect(authService.login).toHaveBeenCalledWith(mockRequest.body);
      expect(mockCookie).toHaveBeenCalledWith(
        'token',
        mockLoginResult.token,
        expect.any(Object)
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockLoginResult,
        message: 'Login successful'
      });
    });

    it('should handle login errors', async () => {
      const errorMessage = 'Invalid credentials';
      vi.spyOn(authService, 'login').mockRejectedValue(new Error(errorMessage));

      await loginController(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('logoutController', () => {
    it('should successfully log out a user', async () => {
      const mockClearCookie = vi.fn();
      mockResponse.clearCookie = mockClearCookie;

      await logoutController(mockRequest as Request, mockResponse as Response);

      expect(mockClearCookie).toHaveBeenCalledWith('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ 
        success: true, 
        message: 'Logout successful' 
      });
    });

    it('should handle logout errors', async () => {
      const mockClearCookie = vi.fn().mockImplementation(() => {
        throw new Error('Logout failed');
      });
      mockResponse.clearCookie = mockClearCookie;
      const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await logoutController(mockRequest as Request, mockResponse as Response);

      expect(mockConsoleError).toHaveBeenCalledWith('Logout Error:', expect.any(Error));
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Failed to logout',
        details: 'Logout failed'
      });

      mockConsoleError.mockRestore();
    });
  });
});