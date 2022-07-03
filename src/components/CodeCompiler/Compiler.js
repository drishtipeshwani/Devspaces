import React from 'react'
import {VStack, HStack, Box, Text, Button, Stack, Flex, Textarea, Heading, Spinner, Center} from '@chakra-ui/react'
const axios = require('axios');

function Compiler({socketRef,roomId,codeRef}) {

   const [input, setInput] = React.useState('');
   const [output, setOutput] = React.useState('');
   const [loading, setLoading] = React.useState(false);

   const compileCode = async () => {
    
    if(codeRef.current){
        setLoading(true);
      const code = codeRef.current;
     
     // Converting code and input to base64
    // Convert code to string
    const code64 = window.btoa(code);
    const input64 = window.btoa(input);
      const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {base64_encoded: 'true', fields: '*'},
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
            'x-rapidapi-host': process.env.REACT_APP_API_HOST,
            'x-rapidapi-key': process.env.REACT_APP_API_KEY
        },
        data: '{"language_id":71,"source_code":"'+code64+'","stdin":"'+input64+'"}'

    };
        axios.request(options).then(function (response) {
            const token = response.data.token;
            const options = {
                method: 'GET',
                url: 'https://judge0-ce.p.rapidapi.com/submissions/'+token,
                headers: {
                    'content-type': 'application/json',
                    'Content-Type': 'application/json',
                    'x-rapidapi-host': process.env.REACT_APP_API_HOST,
                    'x-rapidapi-key': process.env.REACT_APP_API_KEY
                }
            };
            axios.request(options).then(function (response) {
                const output = response.data.stdout;
                console.log(output);
                setOutput(output);
            }).catch(function (error) {
                console.log(error);
            })
            setLoading(false);
        }).catch(function (error) {
            console.error(error);
        });

    }

   }


  return (
     <VStack>
     <Box>
        <Heading size={'md'} padding={'1'}>Enter Input</Heading>
        <Textarea w='250px' h='250px' color={'white'} backgroundColor='gray.800' onChange={(e)=>setInput(e.target.value)}/>
     </Box>
     <Box>
        <Button backgroundColor={'yellow.400'} onClick={compileCode}>Run</Button>
     </Box>
        <Box>
        <Heading size={'md'} padding={'1'}>Output</Heading>
        {loading ? <Center w='250px' h='250px'  color={'white'} backgroundColor='gray.800'>
            <Spinner color={'white'}></Spinner>
        </Center> : <Textarea w='250px' h='250px'  color={'white'} backgroundColor='gray.800' value={output}/>}
        </Box>
        <Box>
        <Button backgroundColor={'yellow.400'} onClick={()=>{setOutput("")}}>Clear Output</Button>
     </Box>
     </VStack>
  )
}

export default Compiler