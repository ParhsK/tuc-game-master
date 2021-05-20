import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayService } from '@app/services/play.service';

@Component({
  selector: 'app-game-selector',
  templateUrl: './game-selector.component.html',
  styleUrls: ['./game-selector.component.scss']
})
export class GameSelectorComponent implements OnInit {

  constructor(public playService: PlayService, private _router: Router) { }

  ngOnInit(): void {
  }

  async onPracticeClick(game: string) {
    await this.playService.findPracticePlay(game);
    this._router.navigate(['/play']);
  }

}
