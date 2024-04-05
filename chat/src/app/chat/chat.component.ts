import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChannelsListComponent } from '../channels-list/channels-list.component'
import { CommonModule } from '@angular/common';
import { MessagesListComponent } from '../messages-list/messages-list.component'
import { Channel } from '../channel';
import { Input } from '@angular/core';
import { SendMessageComponent } from '../send-message/send-message.component';
import { Message } from '../message';
import { SearchMessageComponent } from '../search-message/search-message.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ChannelsListComponent, MessagesListComponent, SendMessageComponent, SearchMessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  title = 'chat';
  selectedChannel: Channel;
  showChannelsList: boolean = true;
  @Input() author: string;


  onChannelSelected(channel : Channel){
    this.selectedChannel = channel;
  }

  onChannelsLoaded(showChannelsList : boolean) {
    this.showChannelsList = showChannelsList;
  }
}
