import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { OpenAI, AzureOpenAI } from 'openai';
import {
  getBearerTokenProvider,
  InteractiveBrowserCredential,
} from '@azure/identity';

@Injectable({
  providedIn: 'root',
})
export class GptService {
  private chatgpt = new OpenAI({
    apiKey: environment.openaiApiKey,
    dangerouslyAllowBrowser: true,
  });

  constructor(private http: HttpClient) {}

  getResponse(content: string): Promise<string | null> {
    return this.chatgpt.chat.completions
      .create({
        messages: [{ role: 'user', content: content }],
        model: 'gpt-3.5-turbo',
      })
      .then((response) => {
        return response.choices[0].message.content;
      });
  }
}
