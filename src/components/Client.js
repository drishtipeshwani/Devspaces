import React from 'react'
import { Avatar, WrapItem, Text,Flex } from '@chakra-ui/react'

function Client({ username }) {
  return (
    <Flex flexDirection={'column'}>
        <Avatar size="sm" name={username} />
        <Text>{username}</Text>
    </Flex>
   
   
  )
}

export default Client