import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { OrderService } from './order.service';

import { PrismaService } from '../../database/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
  let orderService: OrderService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: {
            order: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            product: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
        OrderService,
      ],
    }).compile();

    orderService = moduleRef.get<OrderService>(OrderService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create an order', async () => {
      const data = {
        name: 'John',
        cpf: '12598766985',
        email: 'john@doe.com',
        phone: '81912135670',
        address: 'Test street',
        number: '1321',
        zipCode: '12425-192',
        neighborhood: 'Test neighborhood',
        city: 'Test city',
        state: 'Test State',
        products: [
          {
            id: 1,
            quantity: 1,
          },
          {
            id: 4,
            quantity: 21,
          },
        ],
      };

      const result = {
        id: '2f1d3675-db8c-4c95-a4f8-8e7d2016a273',
        status: 'ACTIVE',
        total: 43221.78,
        createdAt: new Date('2024-05-26T14:43:13.932Z'),
        updatedAt: new Date('2024-05-26T14:43:13.932Z'),
        userId: '0972cf50-216d-4007-8e2c-f98b84199893',
      };

      jest.spyOn(prismaService.product, 'findUnique').mockImplementation((({
        where: { id },
      }) => {
        if (id === 1) {
          return {
            id: 1,
            title: 'Guitar',
            price: 1200.99,
            description: 'A guitar',
            imageURL: 'https://example.com/guitar.jpg',
          };
        }

        return {
          id: 4,
          title: 'Drums',
          price: 2000.99,
          description: 'A drums',
          imageURL: 'https://example.com/drums.jpg',
        };
      }) as any);

      jest.spyOn(prismaService.order, 'create').mockResolvedValue(result);

      expect(
        await orderService.create('0972cf50-216d-4007-8e2c-f98b84199893', data),
      ).toBe(result);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 4 },
      });
      expect(prismaService.product.findUnique).toHaveBeenCalledTimes(2);
      expect(prismaService.order.create).toHaveBeenCalledWith({
        data: {
          userId: '0972cf50-216d-4007-8e2c-f98b84199893',
          products: {
            createMany: {
              data: [
                {
                  productId: 1,
                  quantity: 1,
                  price: 1200.99,
                },
                {
                  productId: 4,
                  quantity: 21,
                  price: 2000.99,
                },
              ],
            },
          },
          status: 'ACTIVE',
          total: 43221.78,
        },
      });
      expect(prismaService.order.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if a product is not found', async () => {
      const data = {
        name: 'John',
        cpf: '12598766985',
        email: 'john@doe.com',
        phone: '81912135670',
        address: 'Test street',
        number: '1321',
        zipCode: '12425-192',
        neighborhood: 'Test neighborhood',
        city: 'Test city',
        state: 'Test State',
        products: [
          {
            id: 1,
            quantity: 1,
          },
          {
            id: 4,
            quantity: 21,
          },
        ],
      };

      const result = {
        id: '2f1d3675-db8c-4c95-a4f8-8e7d2016a273',
        status: 'ACTIVE',
        total: 43221.78,
        createdAt: new Date('2024-05-26T14:43:13.932Z'),
        updatedAt: new Date('2024-05-26T14:43:13.932Z'),
        userId: '0972cf50-216d-4007-8e2c-f98b84199893',
      };

      jest.spyOn(prismaService.product, 'findUnique').mockImplementation((({
        where: { id },
      }) => {
        if (id === 1) {
          return {
            id: 1,
            title: 'Guitar',
            price: 1200.99,
            description: 'A guitar',
            imageURL: 'https://example.com/guitar.jpg',
          };
        }

        return null;
      }) as any);

      jest.spyOn(prismaService.order, 'create').mockResolvedValue(result);

      await expect(
        orderService.create('0972cf50-216d-4007-8e2c-f98b84199893', data),
      ).rejects.toThrow(NotFoundException);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 4 },
      });
      expect(prismaService.product.findUnique).toHaveBeenCalledTimes(2);
      expect(prismaService.order.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should list all orders', async () => {
      const result = [
        {
          id: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
          status: 'ACTIVE',
          total: 1200.999,
          createdAt: new Date('2024-05-26T14:02:13.691Z'),
          updatedAt: new Date('2024-05-26T14:02:13.691Z'),
          userId: '6159d6da-94de-4bf4-880b-f5b6487a66db',
        },
        {
          id: '951490d9-5859-4457-9a44-58a44909544e',
          status: 'ACTIVE',
          total: 1200.999,
          createdAt: new Date('2024-05-26T14:02:33.667Z'),
          updatedAt: new Date('2024-05-26T14:02:33.667Z'),
          userId: '0972cf50-216d-4007-8e2c-f98b84199893',
        },
      ];

      jest.spyOn(prismaService.order, 'findMany').mockResolvedValue(result);

      expect(await orderService.findAll()).toBe(result);
      expect(prismaService.order.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllByUser', () => {
    it('should list all orders from the same user', async () => {
      const result = [
        {
          id: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
          status: 'ACTIVE',
          total: 1200.999,
          createdAt: new Date('2024-05-26T14:02:13.691Z'),
          updatedAt: new Date('2024-05-26T14:02:13.691Z'),
          userId: '6159d6da-94de-4bf4-880b-f5b6487a66db',
        },
        {
          id: '951490d9-5859-4457-9a44-58a44909544e',
          status: 'ACTIVE',
          total: 1200.999,
          createdAt: new Date('2024-05-26T14:02:33.667Z'),
          updatedAt: new Date('2024-05-26T14:02:33.667Z'),
          userId: '6159d6da-94de-4bf4-880b-f5b6487a66db',
        },
      ];

      jest.spyOn(prismaService.order, 'findMany').mockResolvedValue(result);

      expect(await orderService.findAllByUser(result[0].userId)).toBe(result);
      expect(prismaService.order.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.order.findMany).toHaveBeenCalledWith({
        where: { userId: result[0].userId },
      });
    });
  });

  describe('findOne', () => {
    it('should find an order from the same user', async () => {
      const result = {
        id: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
        status: 'ACTIVE',
        total: 1200.999,
        createdAt: new Date('2024-05-26T14:02:13.691Z'),
        updatedAt: new Date('2024-05-26T14:02:13.691Z'),
        products: [
          {
            id: 4,
            productId: 1,
            quantity: 1,
            price: 1200.999,
            orderId: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
            product: {
              id: 1,
              title: 'Guitar',
              price: 1200.999,
              description: 'A guitar',
              imageURL: 'https://example.com/guitar.jpg',
            },
          },
        ],
        userId: '6159d6da-94de-4bf4-880b-f5b6487a66db',
      };

      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(result);

      expect(
        await orderService.findOne(result.id, {
          sub: result.userId,
          roles: [],
        }),
      ).toBe(result);

      expect(prismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: result.id },
        include: {
          products: {
            include: { product: true },
          },
        },
      });
      expect(prismaService.order.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should find an order from any user if the user is an admin', async () => {
      const result = {
        id: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
        status: 'ACTIVE',
        total: 1200.999,
        createdAt: new Date('2024-05-26T14:02:13.691Z'),
        updatedAt: new Date('2024-05-26T14:02:13.691Z'),
        products: [
          {
            id: 4,
            productId: 1,
            quantity: 1,
            price: 1200.999,
            orderId: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
            product: {
              id: 1,
              title: 'Guitar',
              price: 1200.999,
              description: 'A guitar',
              imageURL: 'https://example.com/guitar.jpg',
            },
          },
        ],
        userId: '6159d6da-94de-4bf4-880b-f5b6487a66db',
      };

      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(result);

      expect(
        await orderService.findOne(result.id, {
          sub: '0972cf50-216d-4007-8e2c-f98b84199893',
          roles: ['ADMIN'],
        }),
      ).toBe(result);

      expect(prismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: result.id },
        include: {
          products: {
            include: { product: true },
          },
        },
      });
      expect(prismaService.order.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if order is not found', async () => {
      const result = {
        id: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
        userId: '6159d6da-94de-4bf4-880b-f5b6487a66db',
      };

      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(null);

      await expect(
        orderService.findOne(result.id, {
          sub: result.userId,
          roles: [],
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: result.id },
        include: {
          products: {
            include: { product: true },
          },
        },
      });
      expect(prismaService.order.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user is not allowed', async () => {
      const result = {
        id: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
        status: 'ACTIVE',
        total: 1200.999,
        createdAt: new Date('2024-05-26T14:02:13.691Z'),
        updatedAt: new Date('2024-05-26T14:02:13.691Z'),
        products: [
          {
            id: 4,
            productId: 1,
            quantity: 1,
            price: 1200.999,
            orderId: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
            product: {
              id: 1,
              title: 'Guitar',
              price: 1200.999,
              description: 'A guitar',
              imageURL: 'https://example.com/guitar.jpg',
            },
          },
        ],
        userId: '6159d6da-94de-4bf4-880b-f5b6487a66db',
      };

      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(result);

      await expect(
        orderService.findOne(result.id, {
          sub: '0972cf50-216d-4007-8e2c-f98b84199893',
          roles: [],
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: result.id },
        include: {
          products: {
            include: { product: true },
          },
        },
      });
      expect(prismaService.order.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should cancel an order from the same user', async () => {
      const result = {
        id: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
        status: 'ACTIVE',
        total: 1200.999,
        createdAt: new Date('2024-05-26T14:02:13.691Z'),
        updatedAt: new Date('2024-05-26T14:02:13.691Z'),
        products: [
          {
            id: 4,
            productId: 1,
            quantity: 1,
            price: 1200.999,
            orderId: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
            product: {
              id: 1,
              title: 'Guitar',
              price: 1200.999,
              description: 'A guitar',
              imageURL: 'https://example.com/guitar.jpg',
            },
          },
        ],
        userId: '6159d6da-94de-4bf4-880b-f5b6487a66db',
      };

      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(result);
      jest
        .spyOn(prismaService.order, 'update')
        .mockResolvedValue({ ...result, status: 'CANCELLED' });

      await expect(
        orderService.remove(result.id, {
          sub: result.userId,
          roles: [],
        }),
      ).resolves.toBeUndefined();
      expect(prismaService.order.update).toHaveBeenCalledWith({
        where: { id: result.id },
        data: { status: 'CANCELLED' },
      });
      expect(prismaService.order.update).toHaveBeenCalledTimes(1);
      expect(prismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: result.id },
      });
      expect(prismaService.order.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should cancel an order from any user if the user is an admin', async () => {
      const result = {
        id: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
        status: 'ACTIVE',
        total: 1200.999,
        createdAt: new Date('2024-05-26T14:02:13.691Z'),
        updatedAt: new Date('2024-05-26T14:02:13.691Z'),
        products: [
          {
            id: 4,
            productId: 1,
            quantity: 1,
            price: 1200.999,
            orderId: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
            product: {
              id: 1,
              title: 'Guitar',
              price: 1200.999,
              description: 'A guitar',
              imageURL: 'https://example.com/guitar.jpg',
            },
          },
        ],
        userId: '6159d6da-94de-4bf4-880b-f5b6487a66db',
      };

      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(result);
      jest
        .spyOn(prismaService.order, 'update')
        .mockResolvedValue({ ...result, status: 'CANCELLED' });

      await expect(
        orderService.remove(result.id, {
          sub: '0972cf50-216d-4007-8e2c-f98b84199893',
          roles: ['ADMIN'],
        }),
      ).resolves.toBeUndefined();
      expect(prismaService.order.update).toHaveBeenCalledWith({
        where: { id: result.id },
        data: { status: 'CANCELLED' },
      });
      expect(prismaService.order.update).toHaveBeenCalledTimes(1);
      expect(prismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: result.id },
      });
      expect(prismaService.order.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if order is not found', async () => {
      const result = {
        id: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
        userId: '6159d6da-94de-4bf4-880b-f5b6487a66db',
      };

      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.order, 'update').mockResolvedValue(null);

      await expect(
        orderService.remove(result.id, {
          sub: result.userId,
          roles: [],
        }),
      ).rejects.toThrow(NotFoundException);
      expect(prismaService.order.update).not.toHaveBeenCalled();
      expect(prismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: result.id },
      });
      expect(prismaService.order.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user is not allowed', async () => {
      const result = {
        id: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
        status: 'ACTIVE',
        total: 1200.999,
        createdAt: new Date('2024-05-26T14:02:13.691Z'),
        updatedAt: new Date('2024-05-26T14:02:13.691Z'),
        products: [
          {
            id: 4,
            productId: 1,
            quantity: 1,
            price: 1200.999,
            orderId: '24a370ad-96c1-4d23-a49c-1c490f5ad54c',
            product: {
              id: 1,
              title: 'Guitar',
              price: 1200.999,
              description: 'A guitar',
              imageURL: 'https://example.com/guitar.jpg',
            },
          },
        ],
        userId: '6159d6da-94de-4bf4-880b-f5b6487a66db',
      };

      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(result);
      jest.spyOn(prismaService.order, 'update').mockResolvedValue(null);

      await expect(
        orderService.remove(result.id, {
          sub: '0972cf50-216d-4007-8e2c-f98b84199893',
          roles: [],
        }),
      ).rejects.toThrow(NotFoundException);
      expect(prismaService.order.update).not.toHaveBeenCalled();
      expect(prismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: result.id },
      });
      expect(prismaService.order.findUnique).toHaveBeenCalledTimes(1);
    });
  });
});
