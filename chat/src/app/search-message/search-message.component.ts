import { Component, EventEmitter } from '@angular/core';
import { Output } from '@angular/core';


@Component({
  selector: 'app-search-message',
  standalone: true,
  imports: [],
  templateUrl: './search-message.component.html',
  styleUrl: './search-message.component.css'
})
export class SearchMessageComponent {

  filterChat: string;
  @Output() filterMessageToChat = new EventEmitter<string>();

  postFilter(filterChoose: string){
    this.filterChat = filterChoose;
    this.filterMessageToChat.emit(this.filterChat);
  }

}
