import * as express from 'express';
import * as core from 'express-serve-static-core';
import { ServerConfig } from './server-config';

export class AppComposer {
  public readonly config: ServerConfig;
  public readonly baseUrl: string;
  public readonly express: core.Express;
  public constructor(baseUrl: string, config: ServerConfig) {
    this.baseUrl = baseUrl;
    this.express = express();
    this.config = config;
  }
}

// export default AppComposer;
