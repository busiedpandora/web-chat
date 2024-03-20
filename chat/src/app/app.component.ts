import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChannelsListComponent } from './channels-list/channels-list.component'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ChannelsListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chat';

  
}
