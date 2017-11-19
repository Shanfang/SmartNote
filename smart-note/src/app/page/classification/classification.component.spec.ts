import { FilterNoteContentPipe } from './../classification/classification.component';
import { NoteService } from '../../services/note/note.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import {Injectable, ReflectiveInjector} from '@angular/core';
import {inject, TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import {BaseRequestOptions, ConnectionBackend, Http, RequestOptions, Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {HttpHandler, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

const note_one = {
  "title": "SmartNote is cool",
  "date": "2017-08-29 22:53:30",
  "content": "Welcome to SmartNote, you will love it!"
};
const note_two = {
  "title": "Software Engineering",
  "date": "2017-11-05 09:00:38",
  "contenet": "This is an awesome class, keep on coding!"
};

@Injectable()
  class ClassificationComponent {
  constructor(private http: Http) {}

  getNotes(): Promise<String[]> {
    return this.http.get('localhost:3009/api/notes')
        .toPromise()
        .then(response => response.json().data)
        .catch(e => this.handleError(e));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}

describe('SearchComponent', () => {
  beforeEach(() => {
    this.injector = ReflectiveInjector.resolveAndCreate([
      {provide: ConnectionBackend, useClass: MockBackend},
      {provide: RequestOptions, useClass: BaseRequestOptions},
      Http,
      ClassificationComponent
    ]);
    this.SearchComponent = this.injector.get(ClassificationComponent);
    this.backend = this.injector.get(ConnectionBackend) as MockBackend;
    this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);

    this.testData = require('./mock-searchdata.json');
  });

  it('viewNote() should query current service url', () => {
    this.SearchComponent.getNotes();
    expect(this.lastConnection).toBeDefined('no http service connection at all?');
    expect(this.lastConnection.request.url).toMatch(/api\/notes/, 'url invalid');
  });

  it('all() should return some notes', fakeAsync(() => {
       let result: any;
       this.SearchComponent.getNotes().then((notes: any) => result = notes);
       this.lastConnection.mockRespond(new Response(new ResponseOptions({
         body: JSON.stringify({data: this.testData.notes}),
       })));
       tick();
       expect(result.length).toEqual(this.testData.notes.length, 'should contain given amount of notes');
       expect(result[0]).toEqual(note_one, ' NOTE_ONE should be the first note');
       expect(result[1]).toEqual(note_two, ' NOTE_TWO should be the second note');
     }));

  it('viewNote() response with 404 while server is down', fakeAsync(() => {
       let result: any;
       let catchedError: any;
       this.SearchComponent.getNotes()
           .then((notes: any) => result = notes)
           .catch((error: any) => catchedError = error);
       this.lastConnection.mockRespond(new Response(new ResponseOptions({
         status: 404,
         statusText: 'URL not Found',
       })));
       tick();
       expect(result).toBeUndefined();
       expect(catchedError).toBeDefined();
     }));
});

// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { ClassificationComponent } from './classification.component';
// import {FilterNoteContentPipe} from './classification.component';
// import { TagService } from '../../services/tag/tag.service';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { RouterTestingModule } from '@angular/router/testing';
// import { NoteService } from '../../services/note/note.service';


// describe('ClassificationComponent', () => {
//   let component: ClassificationComponent;
//   let fixture: ComponentFixture<ClassificationComponent>;
//   let pipe: FilterNoteContentPipe;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ClassificationComponent, FilterNoteContentPipe ],
//       providers: [ TagService, NoteService ],
//       imports: [ HttpClientModule, RouterTestingModule ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     pipe = new FilterNoteContentPipe();
//     fixture = TestBed.createComponent(ClassificationComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should be created', () => {
//     expect(component.tabIsActive).toBe(true);
//   });

// });