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
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FriendListComponent } from './components/friend-list/friend-list.component';
import { FriendActionComponent } from './components/friend-action/friend-action.component';
import { UserPerformanceComponent } from './components/user-performance/user-performance.component';
import { MatchHistoryComponent } from './components/match-history/match-history.component';
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
    DashboardComponent,
    FriendListComponent,
    FriendActionComponent,
    UserPerformanceComponent,
    MatchHistoryComponent,
  ],
  imports: [
    AuthModule.forRoot({
      config: {
        authority: 'https://dev-jqe0hc4zidat2q1z.us.auth0.com',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: 'Kmosk0ISBss1diEABRcTzKJwNceZpSqn',
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
