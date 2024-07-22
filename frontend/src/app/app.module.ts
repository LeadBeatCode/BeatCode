import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ProblemComponent } from './components/problem/problem.component';
// import { EditorComponent } from './components/editor/editor.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';

import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { GameMatchingLobbyComponent } from './pages/game-matching-lobby/game-matching-lobby.component';
import { GameRoomComponent } from './pages/game-room/game-room.component';

import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './services/auth.intercepter';

const socketIoConfig: SocketIoConfig = { url: 'http://localhost:3001', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProblemComponent,
    SignInComponent,
    GameMatchingLobbyComponent,
    GameRoomComponent,
  ],
  imports: [
    AuthModule.forRoot({
      config: {
        authority: 'https://dev-3x6di7i1o663vxh0.us.auth0.com',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: 'uX8myf4pVo9ES0OdSJV3P350oPJXcme9',
        scope: 'openid profile email',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        logLevel: LogLevel.Debug,
      },}),

    BrowserModule,
    FormsModule,
    MonacoEditorModule.forRoot(), // use forRoot() in main app module only.
    HttpClientModule,
    SocketIoModule.forRoot(socketIoConfig),
    AppRoutingModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
