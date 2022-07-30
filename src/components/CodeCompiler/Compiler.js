import React from 'react'
import {VStack, HStack, Box, Text, Button, Stack, Flex, Textarea, Heading, Spinner, Center} from '@chakra-ui/react'
import ACTIONS from '../../Actions';
const axios = require('axios');

function Compiler({language,socketRef,roomId,codeRef,onInputChange,onOutputChange,onLoadingChange}) {

   const [input, setInput] = React.useState('');
   const [output, setOutput] = React.useState('');
   const [loading, setLoading] = React.useState(false);


   const inputRef = React.useRef(input);
    const outputRef = React.useRef(output);
    const loadingRef = React.useRef(loading);

   // Creating a map for languageIds
   const languageIds = new Map([
        ['python','71'],
        ['javascript','63'],
        ['ruby','72'],    
        ['go','60'],
        ['cpp','54']]);


    // Define a useEffect to listen for the input and output change events
    React.useEffect(() => {
        inputRef.current = input;
        console.log(inputRef.current);
        onInputChange(input);
        if(socketRef.current) {
        socketRef.current.emit(ACTIONS.INPUT_CHANGE, {
            roomId,
            input,
        });
    }
    }
    ,[input]);

    React.useEffect(() => {
        outputRef.current = output;
        onOutputChange(output);
        if(socketRef.current) {
        socketRef.current.emit(ACTIONS.OUTPUT_CHANGE, {
            roomId,
            output,
        });
    }
    }
    ,[output]);

    React.useEffect(() => {
        loadingRef.current = loading;
        onLoadingChange(loading);
        if(socketRef.current) {
        socketRef.current.emit(ACTIONS.LOADING_CHANGE, {
            roomId,
            loading,
        });
    }
    }
    ,[loading]);


   React.useEffect(() => {
    if(socketRef.current) {
        socketRef.current.on(ACTIONS.INPUT_CHANGE, ({input}) => {
            setInput(input);
        });
    }
    }
    ,[socketRef.current]);

    React.useEffect(() => {
        if(socketRef.current) {
        socketRef.current.on(ACTIONS.OUTPUT_CHANGE, ({output}) => {
            setOutput(output);
        });
    }
    }
    ,[socketRef.current]);

    React.useEffect(() => {
        if(socketRef.current) {
        socketRef.current.on(ACTIONS.LOADING_CHANGE, ({loading}) => {
            setLoading(loading);
        });
    }
    }
    ,[socketRef.current]);
   
    // Function to compile the code
   const compileCode = async () => {
    
    if(codeRef.current){
        setLoading(true);
      const code = codeRef.current;
     
     // Converting code and input to base64
    // Convert code to string
    const code64 = window.btoa(code);
    const input64 = window.btoa(input);

    if(languageIds.has(language)){
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
        data:'{"language_id":'+languageIds.get(language)+',"source_code":"'+code64+'","stdin":"'+input64+'"}'
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

    }else{
        setLoading(false);
        alert('Language not supported');
    }
      
    }

   }


  return (
     <VStack>
     <Box>
        <Heading size={'md'} padding={'1'}>Enter Input</Heading>
        <Textarea w='250px' h='250px' color={'white'} backgroundColor='gray.800' onChange={(e)=>setInput(e.target.value)} id="codeInput" value={input}/>
     </Box>
     <Box>
        <Button colorScheme={'teal'} onClick={compileCode}>Run</Button>
     </Box>
        <Box>
        <Heading size={'md'} padding={'1'}>Output</Heading>
        {loading ? <Center w='250px' h='250px'  color={'white'} backgroundColor='gray.800'>
            <Spinner color={'white'}></Spinner>
        </Center> : <Textarea w='250px' h='250px'  color={'white'} backgroundColor='gray.800' value={output} id="codeOutput"/>}
        </Box>
        <Box>
        <Button colorScheme={'teal'} onClick={()=>{setOutput("")}}>Clear Output</Button>
     </Box>
     </VStack>
  )
}

export default Compiler