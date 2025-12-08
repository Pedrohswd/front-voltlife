import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { HouseComponent } from './house/house.component';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        PagesRoutingModule,
        HouseComponent
    ]
})
export class PagesModule { }
