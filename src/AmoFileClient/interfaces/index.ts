export interface AmoFileClientOptions {
  driveUrl?: string;
  timeout?: number;
  debug?: boolean;
}

export interface SessionParams {
  fileName: string;
  fileSize: number;
  contentType: string;
}

export interface SessionResponse {
  upload_url: string;
  [key: string]: any;
}

export interface UploadResult {
  next_url?: string;
  [key: string]: any;
}

export interface PartInfo {
  index: number;
  start: number;
  end: number;
  isLast: boolean;
}

export interface JwtPayload {
  scopes?: string[];
  [key: string]: any;
}
