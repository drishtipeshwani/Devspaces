import React from 'react'
import { Flex, Heading, HStack, Text, Box, Button, Stack, Select, VStack,Center } from '@chakra-ui/react'
import Client from '../components/Client';
import Canvas from '../components/Canvas';
import Editor from '../components/CodeCompiler/Editor';
import Compiler from '../components/CodeCompiler/Compiler';
import { initSocket } from '../socket';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom'
import { useToast } from '@chakra-ui/react';
import ACTIONS from '../Actions';

function Dashboard() {


  const location = useLocation()
  const reactNavigater = useNavigate()
  const toast = useToast();
  const { roomId } = useParams() // Get the roomId from the url //Destructering the params

  // Creating a socket Reference

  const socketRef = React.useRef(null);
  const codeRef = React.useRef(null);
  const inputRef = React.useRef('');
  const outputRef = React.useRef('');
  const loadingRef = React.useRef(false);
  const languageRef = React.useRef('');

  // Creating a reference for the client video
  const videoRef = React.useRef(null);

  const [Clientlist, setClientlist] = React.useState([]); //Every client is a object with a name and a socket id
  const [language, setLanguage] = React.useState('');

  React.useEffect(() => {
    // As the user joins the room we initialize the client socket which connects to the server
    const init = async () => {

      socketRef.current = await initSocket();

      // Handling connection errors
      socketRef.current.on('connect_error', (err) => handleError(err))
      socketRef.current.on('connect_failed', (err) => handleError(err))

      const handleError = (err) => {
        console.log(err)
        toast({
          title: 'Error connecting to the server',
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        reactNavigater('/')

      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId: roomId,
        username: location.state?.username,
      });

      // Listening for joined event when a even user joins
      socketRef.current.on(ACTIONS.JOINED, ({ clientlist, username, socketId }) => {
        if (username !== location.state?.username) {
          toast({
            title: `${username} has joined the room`,
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        }

        setClientlist(clientlist)

        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          socketId: socketRef.current.id,
          code: codeRef.current,
        });

        socketRef.current.emit(ACTIONS.SYNC_INPUT, {
          socketId: socketRef.current.id,
          input: inputRef.current,
        });

        socketRef.current.emit(ACTIONS.SYNC_OUTPUT, {
          socketId: socketRef.current.id,
          output: outputRef.current,
        });

        socketRef.current.emit(ACTIONS.SYNC_LANGUAGE, {
          socketId: socketRef.current.id,
          language: languageRef.current,
        });

        socketRef.current.emit(ACTIONS.SYNC_LOADING, {
          socketId: socketRef.current.id,
          loading: loadingRef.current,
        });

        socketRef.current.emit(ACTIONS.SYNC_VIDEO, {
          socketId: socketRef.current.id,
          video: videoRef.current,
        });
      })

      // Listening for disconnected event when a even user disconnects
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast({
          title: `${username} has disconnected`,
          status: 'warning',
          duration: 9000,
          isClosable: true,
        })
        // Filter the clientlist to remove the disconnected client
        setClientlist(Clientlist.filter(client => client.socketId !== socketId))

      }
      )

    }
    init()

    // Here we have multiple listeners, so we have to remove them when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current.off(ACTIONS.JOINED)
        socketRef.current.off(ACTIONS.DISCONNECTED)
      }
    }

  }, [])

  React.useEffect(() => {
    languageRef.current = language;
    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
        roomId,
        language: languageRef.current,
      });
    }
  }
    , [language]);


  React.useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ language }) => {
        setLanguage(language);
      });
    }
  }
    , [socketRef.current]);

  const copyRoomID = () => {
    // Copying the current roomId to the clipboard
    navigator.clipboard.writeText(roomId)
    toast({
      title: 'Room ID copied to clipboard',
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
  }

  const handleLeaveRoom = () => {
    reactNavigater('/')
  }



  if (location.state?.username === undefined) {
    <Navigate to="/" />
  }

  return (
    <Flex bg={'blue.50'}
      height={'100vh'}
    >
      <HStack spacing='8'>
        <Box  w='250px' backgroundColor={'gray.800'} color='white' height='100vh' alignItems={'center'} display='flex' flexDirection={'column'}>
          <Heading fontWeight={600} paddingBottom={5} marginTop={'2'}>DEVSPACES</Heading>
          <Box display={'flex'} flexDirection='column' alignItems={'center'}>
            <Text fontWeight={500} fontSize='xl' paddingBottom={5}>Connected Users</Text>
            {Clientlist.map(client => {
              return <Client
                key={client.socketId}
                socketRef={socketRef}
                username={client.username}
                roomId={roomId}
                onVideoChange={(clientVideo) => { videoRef.current = clientVideo }} />
            })}
          </Box>
          <Stack position={'absolute'} bottom='5' justifyContent={'center'} >
            <Button colorScheme={'yellow'} onClick={copyRoomID}>Copy Room ID</Button>
            <Button colorScheme={'red'} onClick={handleLeaveRoom}>Leave Room</Button>
          </Stack>

        </Box>
        {/**Divide the page into 2 parts , one to show connected users and other for the code compiler */}
        <VStack spacing={8}>
          <Box width={'100%'}>
            <Heading size={'md'} padding={'1'}>Code Editor</Heading>
            <Select placeholder='Select Language' onChange={(e) => { setLanguage(e.target.value) }} padding={'1'} value={language} borderColor={'black'}>
              <option value='javascript'>Javascript</option>
              <option value='python'>Python</option>
              <option value='cpp'>C++</option>
              <option value='ruby'>Ruby</option>
              <option value='go'>Go</option>
            </Select>
          </Box>
          <Box width={'100%'} height={'100%'}>
            <Editor
              socketRef={socketRef}
              roomId={roomId}
              onCodeChange={(code) => {
                codeRef.current = code;
              }} />
          </Box>
        </VStack>
        <Box>
          <Compiler
            language={language}
            socketRef={socketRef}
            roomId={roomId}
            codeRef={codeRef}
            onInputChange={(input) => {
              inputRef.current = input;
            }}
            onOutputChange={(output) => {
              outputRef.current = output;
            }}
            onLoadingChange={(loading) => {
              loadingRef.current = loading;
            }}
          />
        </Box>
      </HStack>
    </Flex>

  )
}

export default Dashboard