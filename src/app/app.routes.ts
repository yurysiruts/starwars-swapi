import { Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { StartComponent } from './components/start/start.component';

export const routes: Routes = [
  {
    path: '',
    component: StartComponent
  },
  {
    path: 'game',
    component: GameComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
