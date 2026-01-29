import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AddProduct } from './components/add-product/add-product';

export const routes: Routes = [
    {path: '' , component: Home},
    {path: 'add', component: AddProduct}
];
