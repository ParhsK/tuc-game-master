import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { PlayService } from '@app/services/play.service';

@Component({
  selector: 'app-tictactoe',
  templateUrl: './tictactoe.component.html',
  styleUrls: ['./tictactoe.component.scss']
})
export class TictactoeComponent implements OnInit {
  message = "";
  currentGame?: any;

  constructor(public playService: PlayService, private _authService: AuthService) { }

  ngOnInit(): void {
    this.playService.updateCurrentGame();
    this.updateGameStatus();
  }
  
  async updateGameStatus() {
    this.currentGame = (await this.playService.getPlayStatus()).data;
    console.log(this.currentGame.state);
    if (this.currentGame.status === "PENDING") {
      this.message = "Wait for player 2";
    } else if (this.currentGame.status === "ONGOING") {
      this.message = this.printCurrentPlayer();
    } else if (this.currentGame.status === "WIN") {
      this.message = this.printResult();
    } else if (this.currentGame.status === "DRAW") {
      this.message = "It's a draw";
    } else {
      this.message = "Game is invalid";
    }
  }

  get gameStateArray(): string[] {
    return this.currentGame?.state?.split("") || [];
  }

  async onCellClick(index) {
    if (this.currentGame?.status !== "ONGOING") {
      alert("Game is not playable");
      return;
    }
    const currState = this.gameStateArray;
    currState[index] = this.getPlayerSymbol();
    await this.playService.makeMove(currState.join(""));
    await this.updateGameStatus();
  }

  getPlayerSymbol() {
    const me = this._authService.currentUser._id;
    if (me === this.currentGame?.player1) {
      return 'X';
    } else if (me === this.currentGame?.player2) {
      return 'O';
    } else {
      console.error("something is wrong");
    };
  }

  printCurrentPlayer() {
    const me = this._authService.currentUser._id;
    if (this.currentGame?.lastPlayed === me) {
      return "The other guy plays";
    } else {
      return "You play";
    }
  }

  printResult() {
    const me = this._authService.currentUser._id;
    if (this.currentGame?.status !== "WIN") {
      return "";
    }
    if (this.currentGame?.lastPlayed === me) {
      return "You won!";
    } else {
      return "You lost, noob";
    }
  }

}
