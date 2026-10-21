export type AdminFlag = 'true' | 'false';

export interface Credentials {
  email: string;
  password: string;
}

export interface User extends Credentials {
  nome: string;
  administrador: AdminFlag;
}

export interface CreatedUser extends User {
  _id: string;
}

export interface Product {
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
}

export interface CreatedProduct extends Product {
  _id: string;
}

export interface ApiMessage {
  message: string;
  _id?: string;
  authorization?: string;
}

export type ApiMessageWithFields = ApiMessage & Record<string, unknown>;

export interface UserList {
  quantidade: number;
  usuarios: CreatedUser[];
}

export interface ProductList {
  quantidade: number;
  produtos: CreatedProduct[];
}

export type UserResponse = Partial<CreatedUser> & Partial<ApiMessage>;
export type ProductResponse = Partial<CreatedProduct> & Partial<ApiMessage>;

export interface CartItem {
  idProduto: string;
  quantidade: number;
  precoUnitario: number;
}

export interface NewCart {
  produtos: Array<{ idProduto: string; quantidade: number }>;
}

export interface Cart {
  produtos: CartItem[];
  precoTotal: number;
  quantidadeTotal: number;
  idUsuario: string;
  _id: string;
}

export interface CartList {
  quantidade: number;
  carrinhos: Cart[];
}
