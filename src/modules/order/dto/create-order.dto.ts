export class CreateOrderDto {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
  number: string;
  complement: string;
  zipCode: string;
  neighborhood: string;
  city: string;
  state: string;
  products: {
    id: number;
    quantity: number;
  }[];
}
