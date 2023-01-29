import {useEffect, useState, createRef} from 'react'
import './App.css'

function App() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = createRef<HTMLVideoElement>()

  useEffect(() => {
    // WebRTC stuff:
    const constraints = {
      audio: false,
      video: true
    }

    const initMediaStream: () => void = async () => {
      let _stream: MediaStream | null = null
      try {
        _stream = await navigator.mediaDevices.getUserMedia(constraints)
        setStream(_stream)
        if (videoRef.current) {
          console.log(stream)
          videoRef.current.srcObject = stream
        }
      } catch(err) {
        console.error(err)
      }
    }

    initMediaStream()

  }, [])

  return (
    <div className="App">
      <video playsInline autoPlay className="playback" ref={videoRef}></video>
      <canvas width={640} height={480}></canvas>
    </div>
  )
}

export default App
