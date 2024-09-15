import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GameService } from './game.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule, MatButtonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, 
})
export class GameComponent {

  gameService = inject(GameService);

  get person() {
    return this.gameService.person;
  }

  get starship() {
    return this.gameService.starship;
  }

  get winner() {
    return this.gameService.winner();
  }

  get isLoading() {
    return this.gameService.isLoading();
  }

  get errorMessage() {
    return this.gameService.errorMessage();
  }

  get player1Score() {
    return this.gameService.player1Score();
  }

  get player2Score() {
    return this.gameService.player2Score();
  }
  
  playGame(): void {
    this.gameService.playGame();
  }
}