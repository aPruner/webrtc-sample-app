import React, {useEffect, useState, createRef, MouseEventHandler} from 'react'
import './App.css'

import {initMediaStream, startRecording, stopRecording, playbackRecording, initMediaRecorder} from './webrtcMediaHelpers';

export type Stream = MediaStream | null
export type Recorder = MediaRecorder | null

function App() {
  const [recorder, setRecorder] = useState<Recorder>(null)
  const videoRef = createRef<HTMLVideoElement>()
  const recordedVideoRef = createRef<HTMLVideoElement>()
  const [recordedBlobs, setRecordedBlobs] = useState<Array<any>>([])
  const [errorMsg, setErrorMsg] = useState<string>('')

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
  }

  const handleStopRecording: MouseEventHandler = () => {
    recorder && stopRecording(recorder)
  }

  const handlePlaybackRecording: MouseEventHandler = () => {
    playbackRecording(recordedBlobs, recordedVideoRef)
  }

  return (
    <div className="App">
      {!errorMsg ?
        <div>
          <video playsInline autoPlay className="capture" ref={videoRef}></video>
          <div>
              <button onClick={handleStartRecording} className="video-button">Start Recording</button>
              <button onClick={handleStopRecording} className="video-button">Stop Recording</button>
          </div>
          <h1>Recording: </h1>
          <video playsInline className="playback" ref={recordedVideoRef}></video>
          <button onClick={handlePlaybackRecording} className="video-button">Playback Video</button>
        </div> : <div>{errorMsg}</div>
      }
    </div>
  )
}

export default App
