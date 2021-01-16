import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class LoginInformation {

    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

}

export class UserInfo {
    username: string;
    password?: string;
    administrator: boolean;
}

export class File {
	name: string;
	ext: string;
	id: number;
}

export class Folder {
	name: string;
	folders: Folder[];
	files: File[];
	success: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ServerConnectorService {

    addr: string;
    ssl: boolean;

    token: string;

    headers: HttpHeaders;

    constructor(private http: HttpClient) {
        const token = localStorage.getItem('token');
        const addr = localStorage.getItem('server');
        if (token && addr) {
            this.SetToken(localStorage.getItem('token'));
            this.addr = addr;
        }
    }

    public async GetFilesList(): Promise<Folder> {
        const url = this.addr + 'api/list/files';
        return this.http.get<Folder>(url, { headers: this.headers }).toPromise().then((obj) => {
            if (!obj['success']) {
                throw new Error(obj['message']);
            }
            return obj;
        });
    }
    
    public async Login(info: LoginInformation): Promise<Promise<UserInfo>> {
        const url = this.addr + 'api/login';
        return this.http.post(url, JSON.stringify(info)).toPromise().then((obj) => {
            if (!obj['success']) {
                throw new Error(obj['message']);
            }
            this.SetToken(obj['token']);
            localStorage.setItem('server', this.addr);
            return this.GetLoggedUserInfo();
        });
    }

    private async GetLoggedUserInfo(): Promise<UserInfo> {
        const url = this.addr + 'api/system/user/me';
        return this.http.get(url, { headers: this.headers }).toPromise().then((obj) => {
            if (!obj['success']) {
                throw new Error(obj['message']);
            }
            const u: UserInfo = {
                username: obj['username'],
                administrator: obj['administrator']
            };
            return u;
        });
    }

    public SetAddr(addr: string, ssl: boolean) {
        this.addr = (!addr.endsWith('/')) ? addr + '/' : addr;
        this.addr = (ssl) ? 'https://' + this.addr : 'http://' + this.addr;
    }

    private SetToken(token: string) {
        this.token = token;
        this.headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        });
        localStorage.setItem('token', token);
    }

    public isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        const server = localStorage.getItem('server');
        if (token && server) {
            return true;
        }
        localStorage.removeItem('token');
        localStorage.removeItem('server');
        return false;
    }
}
