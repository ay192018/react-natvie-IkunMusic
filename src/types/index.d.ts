declare module 'node-vibrant/dist/vibrant.worker.min.js';

export interface songItem {
  musicrid: string;
  barrage: string;
  ad_type: string;
  artist: string;
  mvpayinfo: Mvpayinfo;
  pic: string;
  isstar: number;
  rid: number;
  duration: number;
  score100: string;
  ad_subtype: string;
  content_type: string;
  track: number;
  hasLossless: boolean;
  hasmv: number;
  releaseDate: string;
  album: string;
  albumid: number;
  pay: string;
  artistid: number;
  albumpic: string;
  originalsongtype: number;
  songTimeMinutes: string;
  isListenFee: boolean;
  pic120: string;
  name: string;
  online: number;
  payInfo: PayInfo;
  tme_musician_adtype: string;
}

export interface Mvpayinfo {
  play: number;
  vid: number;
  down: number;
}

export interface PayInfo {
  play: string;
  nplay: string;
  overseas_nplay: string;
  local_encrypt: string;
  limitfree: number;
  refrain_start: number;
  feeType: FeeType;
  down: string;
  ndown: string;
  download: string;
  cannotDownload: number;
  overseas_ndown: string;
  listen_fragment: string;
  refrain_end: number;
  cannotOnlinePlay: number;
  paytagindex: Paytagindex;
}

export interface FeeType {
  song: string;
  vip: string;
}

export interface Paytagindex {
  S: number;
  F: number;
  ZP: number;
  H: number;
  ZPGA201: number;
  ZPLY: number;
  HR: number;
  L: number;
  ZPGA501: number;
  DB: number;
  AR501: number;
}
