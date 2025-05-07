import { Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'
import { IndexComponent } from './index/index.component';
export const routes: Routes = [
    { path: '', component: IndexComponent, title: 'Solvex - Soluciones Tecnológicas' },
];
