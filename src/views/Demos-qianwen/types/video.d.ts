// src/types/video.d.ts
export interface Segment {
  id: string;
  startTime: number; // 秒
  endTime: number;   // 秒
  duration: number;  // 持续时间（秒）
  frames: number;    // 帧数
  size: string;      // 大约大小
}

export interface VideoInfo {
  file: File;
  url: string;
  duration: number;
  width: number;
  height: number;
}