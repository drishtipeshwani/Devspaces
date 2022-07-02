import React,{useState} from 'react'
import './Editor.css'
import Header from './Header'
import Editor from '@monaco-editor/react'
import Axios from 'axios';
import { Spinner } from '@chakra-ui/react'


function CodeCompiler() {

   const [userCode,setUserCode] = useState('')
   const [lang,setLang] = useState('')
   const [theme,setTheme] = useState('')
   const [input,setInput] = useState('')
   const [output,setOutput] = useState('')
   const [loading,setLoading]  = useState(false)

  
   const clearOutput = () => {
    setOutput("");
   }

   const compileCode = () => {

    setLoading(true)

    // Only if user can enterned code in the editor we call the compile endpoint

    if(userCode.length > 0){
      Axios.post(`http://localhost:8000/compile`,{code:userCode,lang:lang,theme:theme})
      .then(res => {
      setLoading(false)
      setOutput(res.data.output)
     }).catch(err => {
        setLoading(false)
        setOutput(err.data.output)
     }
     )
    }
 }



  return (
    <div>
      <Header lang={lang} theme={theme} setLang={setLang} setTheme={setTheme}/>
       <div className="main">
        <div className="left-container">
          {/** The Monaco Editor is the code editor that powers VS Code, using the Editor component provided by that */}
          <Editor
            height="calc(100vh - 50px)"
            width="100%"
            theme = {theme}
            language={lang}
            defaultLanguage="javascript"
            defaultValue="# Enter your code here"
            onChange={(value) => { setUserCode(value) }}
          />
          <button className="run-btn" onClick={() => compileCode()}>
             Run
          </button>
        </div>
        <div className="right-container">
          <h4>Input:</h4>
          <div className="input-box">
            <textarea id="code-inp" onChange=
              {(e) => setInput(e.target.value)}>
            </textarea>
          </div>
          <h4>Output:</h4>
          {loading ? (
            <div className="spinner-box">
              <Spinner/>
            </div>
          ) : (
            <div className="output-box">
              <pre>{output}</pre>
              <button onClick={() => { clearOutput() }}
                 className="clear-btn">
                 Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeCompiler