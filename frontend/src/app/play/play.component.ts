import { Component, OnInit } from '@angular/core';
import { PlayService } from '@app/services/play.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

  constructor(public playService: PlayService) { }

  ngOnInit(): void {
    this.playService.updateCurrentGame();
  }

}
