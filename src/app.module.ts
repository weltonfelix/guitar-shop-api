import { Module } from '@nestjs/common';

import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
@Module({
  imports: [ProductModule, OrderModule, AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
