import React, {useEffect, useState, createRef, MouseEventHandler} from 'react'
import './App.css'

import {initMediaStream, startRecording, stopRecording, playbackRecording, initMediaRecorder} from './webrtcMediaHelpers';

export type Stream = MediaStream | null
export type Recorder = MediaRecorder | null

function App() {
  const [recorder, setRecorder] = useState<Recorder>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [recordedBlobs, setRecordedBlobs] = useState<Array<any>>([])
  const [errorMsg, setErrorMsg] = useState<string>('')

  const videoRef = createRef<HTMLVideoElement>()
  const recordedVideoRef = createRef<HTMLVideoElement>()

  useEffect(() => {

    const initWebRTC: () => void = async () => {
      try {
        const _stream = await initMediaStream(videoRef)
        if (_stream) {
          const _recorder = initMediaRecorder(_stream, recordedBlobs, setRecordedBlobs)
          setRecorder(_recorder)
        }
      } catch (err) {
        const errorMsg = 'Unable to configure webRTC'
        console.error(errorMsg)
        setErrorMsg(errorMsg)
      }
    }

    initWebRTC()
  }, [])

  const handleStartRecording: MouseEventHandler = () => {
    recorder && startRecording(recorder)
    setIsRecording(true)
  }

  const handleStopRecording: MouseEventHandler = () => {
    recorder && stopRecording(recorder)
    setIsRecording(false)
  }

  const handlePlaybackRecording: MouseEventHandler = () => {
    console.log(recordedBlobs)
    playbackRecording(recordedBlobs, recordedVideoRef)
  }

  const handleDownloadVideo: MouseEventHandler = () => {
    if (recordedBlobs.length === 0) {
      console.error('Nothing to download')
      return;
    }
    const blob = new Blob(recordedBlobs, {type: 'video/webm'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'video.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  return (
    <div className="App">
      {!errorMsg ?
        <div>
          <video playsInline autoPlay className="capture" ref={videoRef}></video>
          <div>
            <button onClick={handleStartRecording} disabled={isRecording} className="video-button">Start Recording</button>
            <button onClick={handleStopRecording} disabled={!isRecording} className="video-button">Stop Recording</button>
          </div>
          <h1>Recording: </h1>
          <video playsInline className="playback" ref={recordedVideoRef}></video>
          <div>
            <button onClick={handlePlaybackRecording} disabled={recordedBlobs.length === 0} className="video-button">Playback Video</button>
            <button onClick={handleDownloadVideo} disabled={recordedBlobs.length === 0} className="video-button">Download Video</button>
          </div>
        </div> : <div>{errorMsg}</div>
      }
    </div>
  )
}

export default App
