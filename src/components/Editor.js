import React, { useEffect } from 'react'
import {Box, Select} from '@chakra-ui/react'
import EditorView from codemirror
function Editor() {

  const [language, setLanguage] = React.useState('javascript');


  useEffect = () => {
    async function init(){
       EditorView.fromTextArea(document.getElementById('real-time-editor'),{
          mode: {name: language,json: true},
          lineNumbers: true,
          theme: 'material',

       })
    }
  }

  return (
    // Using codemirror
    <Box>
      {/* Dropdown for selecting languages*/}
      <Select placeholder='Select Language'>
    <option value='option1'>C</option>
    <option value='option2'>C++</option>
    <option value='option3'>Javascript</option>
    <option value='option4'>Python</option>
    </Select>
      <textarea id='real-time-editor'></textarea>
    </Box>
    
  )
}

export default Editor