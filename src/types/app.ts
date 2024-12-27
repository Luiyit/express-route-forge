export interface AutoLoad{
  paths: string[];
  exclude?: string[];
  exts?: string[];
}

export interface AppConfig{
  autoLoad: AutoLoad;
  cors: boolean;
  bodyParser: boolean;
  morgan: boolean;
}