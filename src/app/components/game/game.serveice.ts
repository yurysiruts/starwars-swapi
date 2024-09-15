import { inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';
import { SwapiService } from '../../services/swapi.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  person: any = null;
  starship: any = null;

  winner = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  player1Score = signal(0);
  player2Score = signal(0);

  swapiService = inject(SwapiService);

  private previousPerson: any = null;
  private previousStarship: any = null;

  playGame(): void {
    this.errorMessage.set(null);
    this.winner.set(null);
    this.isLoading.set(true);

    forkJoin({
      person: this.swapiService.getRandomPerson().pipe(
        catchError(error => {
          console.error('Error fetching person', error);
          return of(null);
        })
      ),
      starship: this.swapiService.getRandomStarship().pipe(
        catchError(error => {
          console.error('Error fetching starship', error);
          return of(null);
        })
      )
    }).subscribe(({ person, starship }) => {
      if (!person && !starship) {
        this.errorMessage.set('Error: Both requests failed. Please try again.');
        this.isLoading.set(false);
        return;
      }

      // Update with new data if available, or use old values if one call fails
      this.person = person ? person.result.properties : this.previousPerson;
      this.starship = starship ? starship.result.properties : this.previousStarship;

      // Save the current data for future fallback
      if (person) {
        this.previousPerson = this.person;
      }
      if (starship) {
        this.previousStarship = this.starship;
      }

      // Determine winner if both are valid
      if (this.person && this.starship) {
        this.determineWinner();
      } else {
        this.errorMessage.set('Error: Incomplete data. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  private determineWinner(): void {
    const personMass = parseInt(this.person.mass.replace(/,/g, ''), 10);
    const starshipCrew = parseInt(this.starship.crew.replace(/,/g, ''), 10);

    if (!isNaN(personMass) && !isNaN(starshipCrew)) {
      if (personMass > starshipCrew) {
        this.winner.set(`Person wins with mass: ${this.person.mass}`);
        this.player1Score.update(score => score + 1);
      } else if (personMass < starshipCrew) {
        this.winner.set(`Starship wins with crew: ${this.starship.crew}`);
        this.player2Score.update(score => score + 1);
      } else {
        this.winner.set(`It's a tie!`);
      }
      this.isLoading.set(false);
    } else {
      this.errorMessage.set('Data unavailable for comparison');
      this.isLoading.set(false);
    }
  }
}
