import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'aboutus', data: { breadcrumb: 'About' }, loadChildren: () => import('./aboutus/aboutus.module').then(m => m.AboutUsModule) },
        { path: 'crud', data: { breadcrumb: 'Crud' }, loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule) },
        { path: 'empty', data: { breadcrumb: 'Empty' }, loadChildren: () => import('./empty/emptydemo.module').then(m => m.EmptyDemoModule) },
        { path: 'timeline', data: { breadcrumb: 'Timeline' }, loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
