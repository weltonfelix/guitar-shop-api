import { Module } from '@nestjs/common';

import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
@Module({
  imports: [ProductModule, OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
