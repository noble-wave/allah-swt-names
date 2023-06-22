import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NamesService } from '../services/names.service';
import { NameInfo } from '../models/name-info.model';
import { AppService } from '../services/app.service';
import { Observable, tap } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-names-of-allah',
  templateUrl: './names-of-allah.component.html',
  styleUrls: ['./names-of-allah.component.scss'],
})
export class NamesOfAllahComponent implements OnInit {
  dataSource: NameInfo[] = [];
  playbackRate: number = 1.0;
  audioOptions$!: Observable<any>;
  selectedAudio: any;

  @Input() inputSideNav!: MatSidenav;

  constructor(
    private service: NamesService,
    private appService: AppService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getDataList();
    this.audioOptions$ = this.appService
      .getAudioOptions()
      .pipe(tap((x) => this.appService.setSelectedAudio(x[0])));

    this.appService.getSelectedAudio().subscribe((x) => {
      this.selectedAudio = x;
      this.cdr.detectChanges();
    });
    
  }

  getDataList() {
    this.service.getGodNames().subscribe({
      next: (res) => {
        this.dataSource = res;
      },
      error: (err) => {
        'something went worng';
      },
    });
  }

  playSound(item:any){
    // this.appService.playSound.next(item);
  }
  // playSound(filename: string) {
  //   const path = `/assets/sound/${this.selectedAudio.path}/${filename}`;
  //   const audio = new Audio();
  //   audio.playbackRate = this.playbackRate;
  //   audio.src = path;
  //   audio.load();
  //   audio.play();
  // }

  onAudioChange(option: any) {
    this.appService.setSelectedAudio(option);
  }
}
