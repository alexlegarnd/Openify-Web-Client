import { Component, ElementRef, OnInit } from '@angular/core';
import { LoginInformation, ServerConnectorService } from '../services/server-connector/server-connector.service';

interface SaveForm {
    server: string,
    username: string,
    ssl: boolean
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    server: string;
    username: string;
    password: string;

    lock: boolean = false;

    ssl: boolean;

    error: string;

    constructor(private elementRef: ElementRef, private sc: ServerConnectorService) {
        if (sc.isAuthenticated()) {
            location.href = '/app/main';
        }
        const save: string = localStorage.getItem('save-form');
        if (save) {
            const saveObject: SaveForm = JSON.parse(save);
            this.server = saveObject.server;
            this.username = saveObject.username;
            this.ssl = saveObject.ssl;
        }
    }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#92C343';
    }

    ngOnInit(): void {
    }

    connect() {
        this.lockControl(true);
        this.error = undefined;
        const info: LoginInformation = {
            username: this.username,
            password: this.password
        }
        this.sc.SetAddr(this.server, this.ssl);
        this.sc.Login(info).then((p) => {
            this.saveLastConnection();
            location.href = '/app/main';
        }).catch((err) => {
            this.error = err.message;
        }).finally(() => {
            this.lockControl(false);
        });
    }

    lockControl(b: boolean) {
        this.lock = b;
    }

    saveLastConnection() {
        const info: SaveForm = {
            server: this.server,
            username: this.username,
            ssl: this.ssl
        }
        const json = JSON.stringify(info);
        localStorage.setItem('save-form', json);
    }

}
