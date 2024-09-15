import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { GameService } from './game.service';
import { signal } from '@angular/core';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let mockGameService: Partial<GameService>;

  beforeEach(async () => {
    mockGameService = {
      person: null,
      starship: null,
      winner: signal<string | null>(null),
      isLoading: signal(false),
      errorMessage: signal<string | null>(null),
      player1Score: signal(0),
      player2Score: signal(0),
      playGame: jest.fn()
    };
    
    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [{
        provide: GameService,
        useValue: mockGameService
      }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should display the winner when the game is played', () => {
    mockGameService.winner?.set('Person wins with mass: 49');
    mockGameService.isLoading?.set(false);
    mockGameService.person = { name: 'Leia Organa', mass: '49' };
    mockGameService.starship = { name: 'X-wing', crew: '1' };

    fixture.detectChanges();

    const winnerText = fixture.nativeElement.querySelector('[data-test="winner"]');
    expect(winnerText.textContent).toContain('Person wins with mass: 49');
  });

  it('Should call playGame when the play button is clicked', () => {
    const playButton = fixture.nativeElement.querySelector('button');
    playButton.click();

    expect(mockGameService.playGame).toHaveBeenCalled();
  });

  it('Should show the loading spinner when isLoading is true', () => {
    mockGameService.isLoading?.set(true);

    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    // Check the spinner as well
    expect(spinner).toBeTruthy(); 
  });
});
