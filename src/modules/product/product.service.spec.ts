import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { ProductService } from './product.service';

import { PrismaService } from '../../database/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let productService: ProductService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: {
            product: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
        ProductService,
      ],
    }).compile();

    productService = moduleRef.get<ProductService>(ProductService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a product', async () => {
      const data = {
        title: 'Guitar',
        price: 1200.99,
        description: 'A guitar',
        imageURL: 'https://example.com/guitar.jpg',
      };
      const result = {
        id: 1,
        ...data,
      };

      jest.spyOn(prismaService.product, 'create').mockResolvedValue(result);

      expect(await productService.create(data)).toBe(result);
      expect(prismaService.product.create).toHaveBeenCalledWith({ data });
      expect(prismaService.product.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should list all products', async () => {
      const result = [
        {
          id: 1,
          title: 'Guitar',
          price: 1200.99,
          description: 'A guitar',
          imageURL: 'https://example.com/guitar.jpg',
        },
        {
          id: 2,
          title: 'Electric Guitar',
          price: 1400.99,
          description: 'An electric guitar',
          imageURL: 'https://example.com/eguitar.jpg',
        },
      ];

      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(result);

      expect(await productService.findAll()).toBe(result);
      expect(prismaService.product.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('searchByName', () => {
    it('should search products by name', async () => {
      const result = [
        {
          id: 1,
          title: 'Guitar',
          price: 1200.99,
          description: 'A guitar',
          imageURL: 'https://example.com/guitar.jpg',
        },
      ];

      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(result);

      expect(await productService.searchByName('Guitar')).toBe(result);
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          title: {
            contains: 'Guitar',
          },
        },
      });
      expect(prismaService.product.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should find a product by id', async () => {
      const result = {
        id: 1,
        title: 'Guitar',
        price: 1200.99,
        description: 'A guitar',
        imageURL: 'https://example.com/guitar.jpg',
      };

      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(result);

      expect(await productService.findOne(1)).toBe(result);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.product.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if product is not found', async () => {
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(null);

      await expect(productService.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.product.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const data = {
        title: 'Guitar',
        price: 1200.99,
        description: 'A guitar',
        imageURL: 'https://example.com/guitar.jpg',
      };
      const result = {
        id: 1,
        ...data,
      };

      jest
        .spyOn(prismaService.product, 'findUnique')
        .mockResolvedValue({ ...result, title: 'Old Guitar' });
      jest.spyOn(prismaService.product, 'update').mockResolvedValue(result);

      expect(await productService.update(1, data)).toBe(result);
      expect(prismaService.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data,
      });
      expect(prismaService.product.update).toHaveBeenCalledTimes(1);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.product.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if product is not found', async () => {
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.product, 'update').mockResolvedValue(null);

      await expect(productService.update(1, {})).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.product.update).not.toHaveBeenCalled();
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.product.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const product = {
        id: 1,
        title: 'Guitar',
        price: 1200.99,
        description: 'A guitar',
        imageURL: 'https://example.com/guitar.jpg',
      };

      jest
        .spyOn(prismaService.product, 'findUnique')
        .mockResolvedValue(product);
      jest.spyOn(prismaService.product, 'delete').mockResolvedValue(product);

      expect(await productService.remove(1)).toBe(true);
      expect(prismaService.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.product.delete).toHaveBeenCalledTimes(1);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.product.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if product is not found', async () => {
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.product, 'delete').mockResolvedValue(null);

      await expect(productService.remove(1)).rejects.toThrow(NotFoundException);
      expect(prismaService.product.delete).not.toHaveBeenCalled();
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.product.findUnique).toHaveBeenCalledTimes(1);
    });
  });
});
