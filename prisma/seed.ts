import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const users = [
  {
    name: 'Admin',
    isAdmin: true,
    cpf: '12598766285',
    email: 'admin@guitarshop.com',
    password: 'admin',
    passwordConfirmation: 'admin',
    phone: '81912345678',
    address: 'Foo Street',
    zipCode: '12345-678',
    neighborhood: 'Bar Neighborhood',
    city: 'Admin City',
    state: 'Admin State',
  },
];

const products = [
  {
    title: 'Example Guitar',
    price: 999.99,
    description: 'This is an example guitar',
    imageURL: 'https://picsum.photos/500',
  },
];

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: { passwordHash: await bcrypt.hash(user.password, 10) },
      create: {
        address: user.address,
        isAdmin: user.isAdmin,
        email: user.email,
        name: user.name,
        cpf: user.cpf,
        phone: user.phone,
        zipCode: user.zipCode,
        neighborhood: user.neighborhood,
        city: user.city,
        state: user.state,
        passwordHash: await bcrypt.hash(user.password, 10),
      },
    });
  }

  for (const product of products) {
    if ((await prisma.product.count()) === 0) {
      await prisma.product.create({
        data: {
          title: product.title,
          price: product.price,
          description: product.description,
          imageURL: product.imageURL,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
