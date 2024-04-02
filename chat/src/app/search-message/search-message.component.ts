import { Component, EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-message.component.html',
  styleUrl: './search-message.component.css'
})
export class SearchMessageComponent {

  filterChat: string;
  @Output() filterMessageToChat = new EventEmitter<string>();
  show: boolean = true;


  postFilter(filterChoose: string){
    this.filterChat = filterChoose;
    this.filterMessageToChat.emit(this.filterChat);
  }

  toggleVisibility(): void {
    this.show = !this.show;
  }

}
