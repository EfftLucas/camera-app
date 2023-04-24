import { useEffect, useRef, useState } from 'react'

import './App.css'

function App() {
  const videoRef = useRef<HTMLVideoElement>(document.getElementsByClassName('CameraVideo')[0] as HTMLVideoElement)
  const photoRef = useRef<HTMLCanvasElement>(document.getElementsByClassName('Photo')[0] as HTMLCanvasElement)

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  async function selectDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    setDevices(devices)
  }

  async function getVideo(device: string) {
    navigator.mediaDevices.getUserMedia({ video: { deviceId: device, width: 1920, height: 1080 } })
    .then((stream) => {
      const video = videoRef.current;

      video.srcObject = stream;
      video.play();
    })
  }

  async function takePhoto() {
    const height = 800;
    const width = 800;

    const video = videoRef.current;
    const photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    photo.getContext('2d')?.drawImage(video, 0, 0, width, height)
  }

  useEffect(() => {
    selectDevices()
  }, [videoRef])

  return (
    <div>
      <div className='camera'>
        <video className='CameraVideo' ref={videoRef}></video>
        <button onClick={takePhoto}>Snap</button>
      </div>
      <div>
        <select onChange={(e) => {getVideo(e.target.value)}}>
          {devices.map((device) => {
            return <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
          })}
        </select>
      </div>

      <div>
        <canvas className='Photo' ref={photoRef}></canvas>
      </div>
    </div>
  )
}

export default App
