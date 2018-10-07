import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
 
@Injectable()

/** Classe di utility che ha il compito di non permettere agli utenti non loggati 
 *  di navigare all'interno dell'applicazione. */
export class AuthGuard implements CanActivate { 
    constructor(private router: Router) {}
    /**
     * Metodo che fa ritornare l'utente non loggato nella pagina di login se
     * cerca di visualizzare altre pagine.
     * @param route 
     * @param state  
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (sessionStorage.getItem('currentUser')) {
            return true;
        }
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
    
}