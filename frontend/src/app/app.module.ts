import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ProblemComponent } from './components/problem/problem.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';

import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { NgApexchartsModule } from 'ng-apexcharts';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { GameMatchingLobbyComponent } from './pages/game-matching-lobby/game-matching-lobby.component';
import { GameRoomComponent } from './pages/game-room/game-room.component';

import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreditsComponent } from './pages/credits/credits.component';
import { FriendListComponent } from './components/friend-list/friend-list.component';
import { FriendActionComponent } from './components/friend-action/friend-action.component';
import { UserPerformanceComponent } from './components/user-performance/user-performance.component';
import { MatchHistoryComponent } from './components/match-history/match-history.component';
import { AuthInterceptor } from './services/auth.intercepter';
import { FriendComponent } from './components/friend/friend.component';
import { FriendRequestComponent } from './components/friend-request/friend-request.component';
import { RankerElementComponent } from './components/ranker-element/ranker-element.component';
import { QuickMatchHistoryElementComponent } from './components/quick-match-history-element/quick-match-history-element.component';
import { LeetcodeGameMatchingLobbyComponent } from './pages/leetcode-game-matching-lobby/leetcode-game-matching-lobby.component';
import { RankersComponent } from './components/rankers/rankers.component';
import { WinRateRadialbarComponent } from './components/win-rate-radialbar/win-rate-radialbar.component';
import { RadarchartComponent } from './components/radarchart/radarchart.component';
import { environment } from '../environments/environment';
import { TagListComponent } from './components/tag-list/tag-list.component';

const socketIoConfig: SocketIoConfig = {
  url: environment.apiEndpoint,
  options: {},
};

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
    FriendComponent,
    CreditsComponent,
    FriendRequestComponent,
    RankerElementComponent,
    QuickMatchHistoryElementComponent,
    LeetcodeGameMatchingLobbyComponent,
    RankersComponent,
    WinRateRadialbarComponent,
    RadarchartComponent,
    TagListComponent,
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
      },
    }),

    BrowserModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
    HttpClientModule,
    SocketIoModule.forRoot(socketIoConfig),
    AppRoutingModule,
    ReactiveFormsModule,
    NgApexchartsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
