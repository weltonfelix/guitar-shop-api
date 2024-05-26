import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';

import { PrismaService } from '../../database/prisma.service';
import { AuthRequest } from '../auth/guards/auth.guard';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        OrderService,
      ],
    }).compile();

    orderService = moduleRef.get<OrderService>(OrderService);
    orderController = moduleRef.get<OrderController>(OrderController);
  });

  describe('create', () => {
    it('should create an order', async () => {
      const data = {
        products: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 },
        ],
      };

      const request = {
        user: {
          sub: 'a1a2a2a2-1a1a-1a1a-1a1a-1a1a1a1a1a1a',
        },
      } as unknown as AuthRequest;

      const result = {
        id: 'b1b3b3b3-1b1b-1b1b-1b1b-1b1b1b1b1b1b',
        status: 'ACTIVE',
        total: 1000.1,
        createdAt: new Date('2024-05-26T14:43:13.932Z'),
        updatedAt: new Date('2024-05-26T14:43:13.932Z'),
        userId: request.user.sub,
      };

      jest.spyOn(orderService, 'create').mockImplementation(async () => result);

      expect(await orderController.create(data, request)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should list all orders', async () => {
      const result = [
        {
          id: 'b1b3b3b3-1b1b-1b1b-1b1b-1b1b1b1b1b1b',
          status: 'ACTIVE',
          total: 1000.1,
          createdAt: new Date('2024-05-26T14:43:13.932Z'),
          updatedAt: new Date('2024-05-26T14:43:13.932Z'),
          userId: 'a2a2a2a2-1a1a-1a1a-1a1a-1a1a1a1a1a1a',
        },
        {
          id: 'c1c3c3c3-1c1c-1c1c-1c1c-1c1c1c1c1c1c',
          status: 'ACTIVE',
          total: 2000.2,
          createdAt: new Date('2022-05-26T14:43:13.932Z'),
          updatedAt: new Date('2022-05-26T14:43:13.932Z'),
          userId: 'a1a2a2a2-1a1a-1a1a-1a1a-1a1a1a1a1a1a',
        },
      ];

      jest
        .spyOn(orderService, 'findAll')
        .mockImplementation(async () => result);

      expect(await orderController.findAll()).toBe(result);
      expect(orderService.findAll).toHaveBeenCalled();
    });
  });

  describe('findAllByUser', () => {
    it('should list all orders from user', async () => {
      const result = [
        {
          id: 'b1b3b3b3-1b1b-1b1b-1b1b-1b1b1b1b1b1b',
          status: 'ACTIVE',
          total: 1000.1,
          createdAt: new Date('2024-05-26T14:43:13.932Z'),
          updatedAt: new Date('2024-05-26T14:43:13.932Z'),
          userId: 'a1a2a2a2-1a1a-1a1a-1a1a-1a1a1a1a1a1a',
        },
        {
          id: 'c1c3c3c3-1c1c-1c1c-1c1c-1c1c1c1c1c1c',
          status: 'ACTIVE',
          total: 2000.2,
          createdAt: new Date('2022-05-26T14:43:13.932Z'),
          updatedAt: new Date('2022-05-26T14:43:13.932Z'),
          userId: 'a1a2a2a2-1a1a-1a1a-1a1a-1a1a1a1a1a1a',
        },
      ];

      const request = {
        user: {
          sub: 'a1a2a2a2-1a1a-1a1a-1a1a-1a1a1a1a1a1a',
        },
      } as unknown as AuthRequest;

      jest
        .spyOn(orderService, 'findAllByUser')
        .mockImplementation(async () => result);

      expect(await orderController.findAllByUser(request)).toBe(result);
      expect(orderService.findAllByUser).toHaveBeenCalledWith(request.user.sub);
    });
  });

  describe('findOne', () => {
    it('should find an order', async () => {
      const result = {
        id: 'c1c3c3c3-1c1c-1c1c-1c1c-1c1c1c1c1c1c',
        status: 'ACTIVE',
        total: 2000.2,
        createdAt: new Date('2022-05-26T14:43:13.932Z'),
        updatedAt: new Date('2022-05-26T14:43:13.932Z'),
        userId: 'a1a2a2a2-1a1a-1a1a-1a1a-1a1a1a1a1a1a',
        products: [
          {
            id: 4,
            productId: 1,
            quantity: 1,
            price: 2000.2,
            orderId: 'c1c3c3c3-1c1c-1c1c-1c1c-1c1c1c1c1c1c',
            product: {
              id: 1,
              title: 'Guitar',
              price: 2000.2,
              description: 'A guitar',
              imageURL: 'https://example.com/guitar.jpg',
            },
          },
        ],
      };

      const request = {
        user: {
          sub: 'a1a2a2a2-1a1a-1a1a-1a1a-1a1a1a1a1a1a',
        },
      } as unknown as AuthRequest;

      jest
        .spyOn(orderService, 'findOne')
        .mockImplementation(async () => result);

      expect(await orderController.findOne(result.id, request)).toBe(result);
      expect(orderService.findOne).toHaveBeenCalledWith(
        result.id,
        request.user,
      );
    });
  });

  describe('remove', () => {
    it('should cancel an order', async () => {
      const result = {
        id: 'c1c3c3c3-1c1c-1c1c-1c1c-1c1c1c1c1c1c',
        status: 'ACTIVE',
        total: 2000.2,
        createdAt: new Date('2022-05-26T14:43:13.932Z'),
        updatedAt: new Date('2022-05-26T14:43:13.932Z'),
        userId: 'a1a2a2a2-1a1a-1a1a-1a1a-1a1a1a1a1a1a',
        products: [
          {
            id: 4,
            productId: 1,
            quantity: 1,
            price: 2000.2,
            orderId: 'c1c3c3c3-1c1c-1c1c-1c1c-1c1c1c1c1c1c',
            product: {
              id: 1,
              title: 'Guitar',
              price: 2000.2,
              description: 'A guitar',
              imageURL: 'https://example.com/guitar.jpg',
            },
          },
        ],
      };

      const request = {
        user: {
          sub: 'a1a2a2a2-1a1a-1a1a-1a1a-1a1a1a1a1a1a',
        },
      } as unknown as AuthRequest;

      jest.spyOn(orderService, 'remove').mockResolvedValue();

      await expect(
        orderController.remove(
          'c1c3c3c3-1c1c-1c1c-1c1c-1c1c1c1c1c1c',
          request,
        ),
      ).resolves.toBeUndefined();
      expect(orderService.remove).toHaveBeenCalledWith(
        'c1c3c3c3-1c1c-1c1c-1c1c-1c1c1c1c1c1c',
        request.user,
      );
    });
  });
});
