import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NamesService } from './services/names.service';
import { NameInfo } from './models/name-info.model';
import { AppService } from '../app/services/app.service';
import { Observable, delay, tap } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { AudioService } from './services/audio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'allah-swt-names';

  dataSource: NameInfo[] = [];
  playbackRate: number = 1.0;
  audioOptions$!: Observable<any>;
  selectedAudio: any;

  @Input() inputSideNav!: MatSidenav;
  audioOptions?: { name: string; path: string; }[];

  constructor(
    private service: NamesService,
    private appService: AppService,
    private audioService: AudioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getDataList();
    this.appService
      .getAudioOptions()
      .pipe(tap((x) => this.appService.setSelectedAudio(x[0]))).subscribe(x =>{
        this.audioOptions = x;
      });

      this.audioService
      .getSpeakerName()
      .pipe(delay(1000))
      .subscribe((x) => {
        var custom = this.audioOptions?.find(y => y.name === 'Custom');
        if(custom){
          custom.name = x || 'Custom';
        }
        
      });

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


  onAudioChange(option: any) {
    this.appService.setSelectedAudio(option);
  }
}
