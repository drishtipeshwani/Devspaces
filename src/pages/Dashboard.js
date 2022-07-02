import React from 'react'
import { Flex, Heading, HStack,Text,Box,Button,Stack, VStack} from '@chakra-ui/react'
import Client from '../components/Client';
import Canvas from '../components/Canvas';
import CodeCompiler from '../components/CodeCompiler/CodeCompiler';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import {useLocation} from 'react-router-dom'

function Dashboard() {


  const location = useLocation()

  // Creating a socket Reference

  const socketRef = React.useRef(null);

  React.useEffect(()=>{
    // As the user joins the room we initialize the client socket which connects to the server
    const init = async () => {
      socketRef.current = await initSocket(); 
     // socketRef.current.emit(ACTIONS.JOIN,{
     //   roomId,
     //   username: location.state?.username,
     // });
    }
    init()
  },[])

   const [clientlist, setClientlist] = React.useState([
    {socketId: '1', username: 'John Doe'},
    {socketId: '2', username: 'Paul Smith'},
   ]); //Every client is a object with a name and a socket id

  return (
   <Flex bg = {'blue.50'}
   padding={8}
   height={'100vh'}
   >
    <HStack spacing={8}>
    <Box>
    <Heading fontWeight={600} paddingBottom={5}>Devspaces</Heading>
            <Box>
            <Text fontWeight={500} fontSize='xl' paddingBottom= {5}>Connected Users</Text>
               {clientlist.map(client => {
                    return <Client key={client.socketId} username={client.username} />
               })}
            </Box>
            <Stack marginTop={12}>
            <Button colorScheme={'yellow'}>Copy Room ID</Button>
           <Button colorScheme={'red'}>Leave Room</Button>
            </Stack>
           
    </Box>
    <Box>
   <VStack>
     <Canvas/>
     <CodeCompiler/>
   </VStack>
    
    </Box>
    </HStack>
   </Flex>

  )
}

export default Dashboard