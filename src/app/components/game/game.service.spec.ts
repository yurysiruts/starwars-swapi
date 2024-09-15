import { of, throwError } from "rxjs";
import { SwapiService } from "../../services/swapi.service";
import { GameService } from "./game.service"
import { TestBed } from "@angular/core/testing";

describe('GameService', () => {
  let gameService: GameService;

  let swapiService: jest.Mocked<SwapiService>;

  beforeEach(() => {
    const swapiServiceMock = {
      getRandomPerson: jest.fn(),
      getRandomStarship: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        GameService,
        { provide: SwapiService, useValue: swapiServiceMock }
      ]
    });

    gameService = TestBed.inject(GameService);
    swapiService = TestBed.inject(SwapiService) as jest.Mocked<SwapiService>;
  });



  it('Initialize values', () => {
    expect(gameService.person).toBeNull();
    expect(gameService.starship).toBeNull();
    expect(gameService.winner()).toBeNull();
    expect(gameService.errorMessage()).toBeNull();
    expect(gameService.isLoading()).toBeFalsy;
    expect(gameService.player1Score()).toBe(0);
    expect(gameService.player2Score()).toBe(0);
  })

  it('Should determine the winner correctly when both APIs succeed', () => {
    swapiService.getRandomPerson.mockReturnValue(of({ result: { properties: { name: 'Leia Organa', mass: '49' } } }));
    swapiService.getRandomStarship.mockReturnValue(of({ result: { properties: { name: 'X-wing', crew: '1' } } }));

    gameService.playGame();

    expect(gameService.winner()).toBe('Person wins with mass: 49');
    expect(gameService.player1Score()).toBe(1);
    expect(gameService.player2Score()).toBe(0);
    expect(gameService.isLoading()).toBe(false);
  });

  it('Should correctly determine a tie when person mass equals starship crew', () => {
    swapiService.getRandomPerson.mockReturnValue(of({ result: { properties: { name: 'Leia Organa', mass: '1' } } }));
    swapiService.getRandomStarship.mockReturnValue(of({ result: { properties: { name: 'X-wing', crew: '1' } } }));

    gameService.playGame();

    expect(gameService.winner()).toBe(`It's a tie!`);
    expect(gameService.player1Score()).toBe(0);
    expect(gameService.player2Score()).toBe(0);
    expect(gameService.isLoading()).toBe(false);
  });

  it('Should set error message if both API calls fail', () => {
    swapiService.getRandomPerson.mockReturnValue(throwError(() => new Error('Error fetching person')));
    swapiService.getRandomStarship.mockReturnValue(throwError(() => new Error('Error fetching starship')));

    gameService.playGame();

    expect(gameService.errorMessage()).toBe('Error: Both requests failed. Please try again.');
    expect(gameService.isLoading()).toBe(false);
  });

  it('Should use previous person if person API fails and starship API succeeds', () => {
    gameService.previousPerson = { name: 'Luke Skywalker', mass: '77' };

    swapiService.getRandomPerson.mockReturnValue(throwError(() => new Error('Error fetching person')));
    swapiService.getRandomStarship.mockReturnValue(of({ result: { properties: { name: 'X-wing', crew: '1' } } }));

    gameService.playGame();

    expect(gameService.person).toEqual({ name: 'Luke Skywalker', mass: '77' });
    expect(gameService.starship).toEqual({ name: 'X-wing', crew: '1' });
    expect(gameService.isLoading()).toBe(false);
  });

  it('Should use previous starship if starship API fails and person API succeeds', () => {
    gameService.previousStarship = { name: 'Millennium Falcon', crew: '5' };

    swapiService.getRandomPerson.mockReturnValue(of({ result: { properties: { name: 'Leia Organa', mass: '49' } } }));
    swapiService.getRandomStarship.mockReturnValue(throwError(() => new Error('Error fetching starship')));

    gameService.playGame();

    expect(gameService.person).toEqual({ name: 'Leia Organa', mass: '49' });
    expect(gameService.starship).toEqual({ name: 'Millennium Falcon', crew: '5' });
    expect(gameService.isLoading()).toBe(false);
  });

  it('should set error message if data is unavailable for comparison', () => {
    swapiService.getRandomPerson.mockReturnValue(of({ result: { properties: { name: 'Leia Organa', mass: 'unknown' } } }));
    swapiService.getRandomStarship.mockReturnValue(of({ result: { properties: { name: 'X-wing', crew: 'unknown' } } }));

    gameService.playGame();

    expect(gameService.errorMessage()).toBe('Data unavailable for comparison');
    expect(gameService.isLoading()).toBe(false);
  });
})