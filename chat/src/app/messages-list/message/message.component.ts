import { Component } from '@angular/core';
import { Message } from '../../message';
import { Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [NgIf],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input() message : Message;


  formatDate(date : Date) {
    let formattedDate = date.toLocaleString(
      'it-CH', { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit', 
      hour12: true });

    formattedDate = formattedDate.replace("T", " ").slice(0, -7);

    return formattedDate;
  }
}
