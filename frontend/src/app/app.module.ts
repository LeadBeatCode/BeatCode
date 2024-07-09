import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ProblemComponent } from './components/problem/problem.component';
// import { EditorComponent } from './components/editor/editor.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

const socketIoConfig: SocketIoConfig = { url: 'http://localhost:3001', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProblemComponent /* EditorComponent */,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MonacoEditorModule.forRoot(), // use forRoot() in main app module only.
    HttpClientModule,
    SocketIoModule.forRoot(socketIoConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
