import { ParamsDictionary } from "src/types/express";
import { Request } from "express";
import { ParsedQs } from 'qs';
import { Method } from "src/types";

interface RequestInit {
  method: Method;
  params?: ParamsDictionary;
  query?: ParsedQs;
  body?: any;
  header?: Headers;
  serverUrl?: string;
}

export default class MockRequest {
  private reqUrl: URL;    
  public method: string;
  public query: Record<string, unknown>;
  public params: Record<string, unknown>;
  public body: any;

  constructor(private reqInit: RequestInit){ 
    this.reqUrl = new URL(this.reqInit.serverUrl || 'https://express-mock-server.com');

    this.query = this.reqInit.query || {};
    this.params = this.reqInit.params || {};
    this.body = this.reqInit.body || {};
    this.method = this.reqInit.method.toLowerCase();
  }

  get url(){ return this.reqUrl.toString(); }
  get protocol(){ return this.reqUrl.protocol; }
  get headers(){ 
    const headers = this.reqInit.header || new Headers()
    headers.append('host', this.reqUrl.host);
    return headers;
  }

  static create(reqInit: RequestInit): Request {
    return new MockRequest(reqInit) as unknown as Request;
  }
}