import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

import { PrismaService } from '../../database/prisma.service';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        ProductService,
      ],
    }).compile();

    productService = moduleRef.get<ProductService>(ProductService);
    productController = moduleRef.get<ProductController>(ProductController);
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

      jest
        .spyOn(productService, 'create')
        .mockImplementation(async () => result);

      expect(await productController.create(data)).toBe(result);
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
          id: 3,
          title: 'Another Guitar',
          price: 1600.9,
          description: 'Another guitar',
          imageURL: 'https://example.com/guitar2.jpg',
        },
      ];

      jest
        .spyOn(productService, 'findAll')
        .mockImplementation(async () => result);

      expect(await productController.findAll()).toBe(result);
    });
  });

  describe('search', () => {
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

      jest
        .spyOn(productService, 'searchByName')
        .mockImplementation(async () => result);

      expect(await productController.search({ query: 'Guitar' })).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should find a product', async () => {
      const result = {
        id: 1,
        title: 'Guitar',
        price: 1200.99,
        description: 'A guitar',
        imageURL: 'https://example.com/guitar.jpg',
      };

      jest
        .spyOn(productService, 'findOne')
        .mockImplementation(async () => result);

      expect(await productController.findOne('1')).toBe(result);
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
        .spyOn(productService, 'update')
        .mockImplementation(async () => result);

      expect(await productController.update('1', data)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      jest.spyOn(productService, 'remove').mockImplementation(async () => true);

      expect(await productController.remove('1')).toBe(true);
    });
  });
});
