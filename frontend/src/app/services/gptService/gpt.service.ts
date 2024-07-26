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
    apiKey: 'sk-proj-ExjG1m4cJ0VFYlJrE8fOT3BlbkFJ4n10ruuAMlW75HCsFuRr',
    dangerouslyAllowBrowser: true,
  });

  //private openai: AzureOpenAI;

  constructor(private http: HttpClient) {
    // const credential = new InteractiveBrowserCredential({clientId: "redirect"});
    // const scope = 'https://cognitiveservices.azure.com/.default';
    // const azureADTokenProvider = getBearerTokenProvider(credential, scope);
    // this.openai = new AzureOpenAI({
    //   azureADTokenProvider
    // });
  }
  /**
   * HttpClient has methods for all the CRUD actions: get, post, put, patch, delete, and head.
   * First parameter is the URL, and the second parameter is the body.
   * You can use this as a reference for how to use HttpClient.
   * @param content The content of the message
   * @returns
   */

  getResponse(content: string): Promise<string | null> {
    //const returnData = null;
    return this.chatgpt.chat.completions
      .create({
        messages: [{ role: 'user', content: content }],
        model: 'gpt-3.5-turbo',
      })
      .then((response) => {
        console.log(response);
        console.log(response.choices[0].message.content);
        return response.choices[0].message.content;
      });
  }
}
