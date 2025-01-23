import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../Shared/SideMenu/SideMenu.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SideMenuComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainComponent implements OnInit {
  constructor(private router: Router)
  {

  }

  ngOnInit(): void { }

}
