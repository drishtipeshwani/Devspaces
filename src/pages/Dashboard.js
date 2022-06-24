import React from 'react'
import { Flex, Heading, HStack,Text,Box,Button,Stack} from '@chakra-ui/react'
import Client from '../components/Client';
import Editor from '../components/Editor';

function Dashboard() {

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
    <Editor/>
    </Box>
    </HStack>
   </Flex>

  )
}

export default Dashboard