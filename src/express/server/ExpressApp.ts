import { Application } from "express";
import requireDirectoryFiles from "../../utils/requireDirectoryFiles";
import * as http from 'http';
import { AppConfig, AutoLoad } from "../../types/app";
import { CoreExpressRouter } from "../router";

export default class ExpressApp {
  /**
   * Singleton instance
   */
  static _instance: ExpressApp;

  /**
   * Port to listen the server
   */
  public port: string = '8000';

  /**
   * Http server instance
   */
  public httpServer: http.Server | null = null;

  /**
   * Constructor
   * 
   * @param { Application } app express application
   * @param { AutoLoad } autoLoad auto load configuration
   */
  constructor(protected app: Application, protected config: AppConfig) {}

  /**
   * Create Server instance
   *
   * @returns Singleton instance
   */
  static initInstance(app: Application, config: AppConfig): ExpressApp {
    if (!this._instance) this._instance = new ExpressApp(app, config);
    return this._instance;
  }

  /**
   * Start the server
   * 
   * @param callback listen callback
   */
  public start(callback?: () => void) {
    this.cors();
    this.bodyParser();
    this.morgan();
    
    this.autoLoadFiles();
    this.listen(callback);
  }

  protected cors() {
    if(this.config.cors) {
      const cors = require('cors');
      this.app.use(cors());
    }
  }

  protected bodyParser() {
    if(this.config.bodyParser) {
      const bodyParser = require('body-parser');
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: true }));
    }
  }

  protected morgan() {
    if(this.config.morgan) {
      const morgan = require('morgan');
      this.app.use(morgan('tiny'));
    }
  }
  
  private autoLoadFiles() {
    const { autoLoad } = this.config;

    autoLoad.paths.forEach((path) => {
      requireDirectoryFiles(path, autoLoad.exclude, autoLoad.exts);
    });

    /**
     * DEV NOTE:
     *
     * Express expose Router interface
     * It could be used to add more complex routes
     * Because this router is static,
     * we will use a single router instance to add all routes
     *
     * That's why we need to include the app route in the server
     * Make sure to call it after all routes are added
     */
    this.app.use(CoreExpressRouter.expressRouter);
  }

  private listen(callback?: () => void) {
    this.httpServer = this.app.listen(this.port, () => {
      if(callback) callback();
    });
  }
}