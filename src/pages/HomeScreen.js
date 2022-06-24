import React from 'react'
import {
    Flex,
    Container,
    Heading,
    Stack,
    Text,
    Button,
    Image,
    Link
  } from '@chakra-ui/react';
  import {Link as ReachLink} from 'react-router-dom'
  import Illustration from '../assets/Illustration.svg'

function HomeScreen() {
  return (
    <Container maxW={'100xl'} bg='blue.50' height={'100vh'}>
        <Stack textAlign={'center'}
      align={'center'}
      spacing={10}
      paddingTop={8}>
        <Heading
        fontWeight={600}
        fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
        lineHeight={'110%'} color={'purple.400'}>
          Devspaces
      </Heading>
      <Heading
        fontWeight={600}
        fontSize={{ base: '2xl', sm: '3xl', md: '5xl' }}
        lineHeight={'110%'}>
        Coding Together{' '}
        <Text as={'span'} color={'orange.400'}>
          Made Easy
        </Text>
      </Heading>
      <Text color={'gray.500'} maxW={'3xl'}  fontSize={'xl'}>
        Devspaces is a platform for developers to collaborate on code together.
      </Text>
      <Stack spacing={6} direction={'row'}>
          <Button
            rounded={'full'}
            px={6}
            colorScheme={'orange'}
            bg={'orange.400'}
            _hover={{ bg: 'orange.500' }}>
          <Link as={ReachLink} to='/login' >Get started</Link>  
          </Button>
        </Stack>
      <Flex alignItems={'center'}>
       <Image src = {Illustration}></Image>
       </Flex>
    </Stack>
  </Container>
  )
}

export default HomeScreen