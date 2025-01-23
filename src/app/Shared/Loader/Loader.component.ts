import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './Loader.component.html',
  styleUrl: './Loader.component.css',
})
export class LoaderComponent { }
