import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ServerConnectorService } from '../server-connector/server-connector.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private sc: ServerConnectorService, private router: Router) { }

    canActivate(): boolean {
        if (!this.sc.isAuthenticated()) {
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }

}
