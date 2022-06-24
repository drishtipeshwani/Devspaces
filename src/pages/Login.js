import React from 'react'
import {
    Flex,
    Container,
    Heading,
    Stack,
    Text,
    Button,
    Image,
    HStack,
    Link,
    Box,
    FormControl,
    FormLabel,
    Input,
  } from '@chakra-ui/react';
  import { useToast } from '@chakra-ui/react';
  import { v4 as uuidv4 } from 'uuid'; // Generate a random id for the room
  import {useNavigate} from 'react-router-dom';

function Login() {

    const toast = useToast();
    const navigate = useNavigate();

    const [roomId, setRoomId] = React.useState('');
    const [username, setUsername] = React.useState('');


   const generateRoomId = () => {
    setRoomId(uuidv4());
     toast({
        title: 'New Room Created',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            joinRoom();
        }
    }

    const joinRoom = () => {
        if(roomId === '' || username === '') {
            toast({
            title: 'Please fill in all fields',
            status: 'error',
            duration: 9000,
            isClosable: true,
            })
        }
        else {
            // Navigate to the room
            navigate(`/dashboard/${roomId}`,{
                state: {
                    username: username
                }

            });
        }

    }
     

  return (
    <Flex
    bg = {'blue.50'}
    minH={'100vh'}
    align={'center'}
    justify={'center'}>
    <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
      <Stack align={'center'}>
        <Heading fontSize={'4xl'}>Welcome to Devspaces</Heading>
        <Text fontSize={'lg'} color={'gray.600'}>
          Enter your invitation code below✌️
        </Text>
      </Stack>
      <Box
        rounded={'lg'}
        boxShadow={'lg'}
        p={8} bg={'white'}>
        <Stack spacing={4}>
          <FormControl id="roomid">
            <FormLabel>Room ID</FormLabel>
            <Input type="text" value={roomId} onChange={(e)=>{setRoomId(e.target.value)}} onKeyUp={(e)=>handleKeyPress(e)}/>
          </FormControl>
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}} onKeyUp={(e)=>handleKeyPress(e)} />
          </FormControl>
          <Stack spacing={10}>
            <Button
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }} onClick={joinRoom}>
             Join
            </Button>
          </Stack>
          <Stack pt={6}>
              <Text align={'center'}>
                Don't have a invite code? <Link color={'blue.400'} onClick={generateRoomId}>Create one</Link>
              </Text>
            </Stack>
        </Stack>
      </Box>
    </Stack>
  </Flex>
  )
}

export default Login