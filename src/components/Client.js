import React,{useEffect,useState} from 'react'
import { Box } from '@chakra-ui/react'
import { AspectRatio } from '@chakra-ui/react'
import ACTIONS from '../Actions'

function Client({ socketRef, username, roomId,onVideoChange }) {

  const [mediaStream, setMediaStream] = useState(null);

  const videoRef = React.useRef(null);

 

    useEffect(() => {
      async function enableStream() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({audio: true, video:true});
          setMediaStream(stream);
          videoRef.current.srcObject = stream;
        } catch(err) {
          console.log(err);
        }
      }
  
      if (!mediaStream) {
        enableStream();
      } else {
        return function cleanup() {
          mediaStream.getTracks().forEach(track => {
            track.stop();
          });
        }
      }
    }, [mediaStream]);
  
  
  return (
    <Box marginTop={'2'}>
        <AspectRatio ratio={1} h='125px' w='200px' >
          <video ref={videoRef} autoPlay playsInline muted />
        </AspectRatio>
      </Box>

  )
}

export default Client