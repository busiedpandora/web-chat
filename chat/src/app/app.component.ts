import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChannelsListComponent } from './channels-list/channels-list.component'
import { CommonModule } from '@angular/common';
import { MessagesListComponent } from './messages-list/messages-list.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ChannelsListComponent, MessagesListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chat';
  selectedChannelId: number;
  
  onChannelSelected(channelId : number){
    this.selectedChannelId = channelId;
  }
}
