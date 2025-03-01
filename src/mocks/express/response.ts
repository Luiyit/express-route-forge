import { ParamsDictionary } from "src/types/express";
import { Errback, Response } from "express";
import { ParsedQs } from 'qs';
import { Method } from "src/types";
import { trackCalls } from "src/utils/jest";

interface RequestInit {
  method: Method;
  params?: ParamsDictionary;
  query?: ParsedQs;
  body?: any;
  header?: Headers;
  serverUrl?: string;
}

export default class MockResponse {
  
  constructor(){
    trackCalls(this, ['status', 'send', 'json', 'download', 'setHeader']);
  }

  json(body: any) { 
    return this; 
  }

  status(code: number) { 
    return this; 
  }

  send<ResBody = any>(body?: ResBody){ 
    return this; 
  }

  setHeader(name: string, value: number | string | readonly string[]) {
    return this;
  }

  download(path: string, filename: string, fn?: Errback) {}

  static create(): Response {
    return new MockResponse() as unknown as Response;
  }
}