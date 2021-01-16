import { Component, OnInit } from '@angular/core';
import { AudioService, StreamState } from '../services/audio/audio.service';
import { Folder, File, ServerConnectorService } from '../services/server-connector/server-connector.service';

export class Model {
  name: string;
  isFile: boolean;
  folders?: Folder;
  files?: File;
}

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss']
})
export class MainWindowComponent implements OnInit {

  displayedColumns: string[] = ['name'];
  root: Folder;
  currentFolder: Folder;
  currentFIle: File;
  model: Model[] = [];
  state: StreamState;

  disabled: boolean = true;

  constructor(private sc: ServerConnectorService, private player: AudioService) {
    sc.GetFilesList().then((root) => {
      this.root = root;
      this.setAsCurrentFolder(this.root);
    });
  }

  setAsCurrentFolder(currentFolder: Folder) {
    this.currentFolder = currentFolder;
    this.model = [];
    this.currentFolder.folders.forEach((fol) => {
      this.model.push({name: fol.name, isFile: false, folders: fol});
    });
    this.currentFolder.files.forEach((file) => {
      this.model.push({name: file.name, isFile: true, files: file});
    });
  }

  ngOnInit(): void {
  }

  logout() {
    localStorage.removeItem('token');
    location.reload();
  }

}
