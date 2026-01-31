import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AddProduct } from './components/add-product/add-product';
import { Cart } from './pages/cart/cart';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { Order } from './pages/order/order';
import { ProductDetails } from './pages/product-details/product-details';

export const routes: Routes = [
    {path: '' , component: Home},
    {path: 'add', component: AddProduct},
    {path: 'cart', component: Cart},
    {path: 'login', component: Login},
    {path: 'sign-up', component: SignUp},
    {path: 'order', component: Order},
    {path: 'productDetails/:productId', component: ProductDetails},
];
