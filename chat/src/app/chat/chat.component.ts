import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ChannelsListComponent } from '../channels-list/channels-list.component'
import { CommonModule } from '@angular/common';
import { MessagesListComponent } from '../messages-list/messages-list.component'
import { Channel } from '../channel';
import { Input } from '@angular/core';
import { SendMessageComponent } from '../send-message/send-message.component';
import { SearchMessageComponent } from '../search-message/search-message.component';
import { AppConfig } from '../../config';
import { Message } from '../message';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ChannelsListComponent, MessagesListComponent, SendMessageComponent, SearchMessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  title = 'chat';
  apiKey: string;
  selectedChannel: Channel;
  @Input() url: string
  @Input() showChannelsList: boolean;
  @Input() showSearchBar: boolean;
  @Input() author: string;
  @ViewChild(ChannelsListComponent) channelsListComponent: ChannelsListComponent;
  @ViewChild(MessagesListComponent) messagesListComponent: MessagesListComponent;
  @Output() messageInChatClickedEvent = new EventEmitter<Message>();
  

  constructor() {}

  ngOnInit() {
    this.apiKey = AppConfig.apiKey;
  }

  onChannelSelected(channel : Channel){
    this.selectedChannel = channel;
    setTimeout(() => {
      this.messagesListComponent.scrollToBottom();
    }, 200)
  }

  onChannelsLoaded(length : number) {
    this.showChannelsList = length >= 1;
  }

  onReceivedMessageFromOtherChannel(channelId: number) {
    this.channelsListComponent.increaseNumberOfUnreadMessagesInChannel(channelId);
  }

  onToggleChannels(value: boolean) {
    this.showChannelsList = value;
  }

  onMessageInChatClick(message: Message) {
    this.messageInChatClickedEvent.emit(message);
  }
}
