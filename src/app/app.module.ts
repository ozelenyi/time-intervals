import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from "@angular/material/table";
import {CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    ScrollingModule,
  ],
  providers: [CdkVirtualScrollViewport],
  bootstrap: [AppComponent]
})
export class AppModule {
}
