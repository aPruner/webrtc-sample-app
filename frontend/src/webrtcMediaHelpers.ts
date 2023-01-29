import {RefObject} from "react";
import {Recorder, Stream} from "./App";

const constraints = {
  audio: false,
  video: true
}

const mimeType: string = 'video/webm;codecs=h264,opus'

// export const initMediaStream: (setStream: (stream: MediaStream | null) => void, videoRef: any) => void = async (setStream, videoRef) => {
//   let stream: MediaStream | null = null
//   try {
//     stream = await navigator.mediaDevices.getUserMedia(constraints)
//     // TODO: Can we return the stream instead of setting it inline? would prefer not to pass setters around like this
//     setStream(stream)
//     if (videoRef.current) {
//       videoRef.current.srcObject = stream
//     }
//     console.log('Created MediaStream', stream)
//   } catch(err) {
//     console.error(err)
//   }
// }

export const initMediaStream: (videoRef: any) => Promise<Stream> = async (videoRef) => {
  let stream: MediaStream | null = null
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints)
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
    console.log('Created MediaStream', stream)
    return stream
  } catch(err) {
    console.error(err)
    return null
  }
}

// TODO: Fix any types
export const initMediaRecorder: (stream: MediaStream,
                                 recordedBlobs: Array<any>,
                                 setRecordedBlobs: (recordedBlobs: Array<any>) => void) => Recorder = (stream,
                                                                                                   recordedBlobs, setRecordedBlobs) => {
  const options = {mimeType}
  let mediaRecorder = null
  try {
    mediaRecorder = new MediaRecorder(stream, options)
    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    mediaRecorder.onstop = (event: Event) => {
      console.log('Recorder stopped: ', event)
      console.log('Recorded Blobs: ', recordedBlobs);
    };

    // TODO: fix any type
    const handleDataAvailable: (event: any) => void = (event) => {
      console.log('handleDataAvailable', event, typeof event)
      if (event.data && event.data.size > 0) {
        const recordedBlobsCopy: Array<any> = JSON.parse(JSON.stringify(recordedBlobs))
        recordedBlobsCopy.push(event.data);
        setRecordedBlobs(recordedBlobsCopy)
      }
    }

    mediaRecorder.ondataavailable = handleDataAvailable;
    return mediaRecorder
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    return null;
  }
}

export const startRecording: (mediaRecorder: MediaRecorder) => void = (mediaRecorder) => {
  mediaRecorder.start();
  console.log('Recorder started', mediaRecorder);
}

export const stopRecording: (mediaRecorder: MediaRecorder) => void = (mediaRecorder) => {
  mediaRecorder.stop();
  console.log('Recorder stopped', mediaRecorder);
}

// TODO: Fix any types
export const playbackRecording: (recordedBlobs: any, recordedVideoRef: RefObject<HTMLVideoElement>) => void = async (recordedBlobs, recordedVideoRef) => {
  const superBuffer = new Blob(recordedBlobs, {type: mimeType});
  const recordedVideo: HTMLVideoElement | null = recordedVideoRef.current
  if (recordedVideo) {
    recordedVideo.src = '';
    recordedVideo.srcObject = null;
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.controls = true;
    await recordedVideo.play();
  } else {
    console.error('Cannot playback video, recordedVideoRef is null')
  }
}

