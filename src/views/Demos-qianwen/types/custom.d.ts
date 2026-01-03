export interface VideoInfo {
    duration: number,
    videoWidth: number,
    videoHeight: number,
    url: string,
    filename: string,
    ext: string
}

export interface VideoMetadata {
  duration: number
  videoWidth: number
  videoHeight: number
}

export interface VideoDisplayInfo {
  offsetX: number,
  offsetY: number,
  displayWidth: number,
  displayHeight: number,
  containerWidth: number,
  containerHeight: number
}

export interface SelectionOptions {
  aspectRatio: number | undefined
}

export interface Selection {
  x: number,
  y: number,
  width: number,
  height: number,
}

export interface Segment {
  id: string,
  offsetX: number,
  offsetY: number
}

export interface VideoSegment {
  id: string;
  startTime: number; // 秒
  endTime: number;   // 秒
  duration: number;  // 持续时间（秒）
  frames: number;    // 帧数
  size: string;      // 大约大小
  enableCrop?: boolean;
  cropWidth?: number; // 原始视频像素宽度
  cropHeight?: number; // 原始视频像素高度
  cropX?: number; // 原始视频像素X偏移
  cropY?: number; // 原始视频像素Y偏移
}