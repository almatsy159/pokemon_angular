import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Game } from '../services/game';

export const starterSelectedGuard: CanActivateFn = (route, state) => {
  const gameService = inject(Game)
  const router = inject(Router)
  if (gameService.teamSize() < 1) {
    alert("cannot encounter empty team ! redirected to /")
    return router.parseUrl("")
  } else if (router.url.length > 1 && gameService.teamSize() > 1) {
    alert("cannot go back to encounter team not empty ! redirected to /layout")
    return router.parseUrl("/layout")
  }
  alert("not rerouted")
  return true;
};


