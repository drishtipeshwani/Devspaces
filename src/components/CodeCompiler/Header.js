import React from 'react'
import Select from 'react-select'
import './Header.css'

export default function Header({lang,theme,setLang,setTheme}) {

  const languages = [
    {value: 'javascript', label: 'JavaScript'},
    {value: 'python', label: 'Python'},
    {value:'cplusplus', label: 'C++'},
    {value: 'c', label: 'C'},
    {value: 'java', label: 'Java'},
  ]

    const themes = [
    {value: 'vs-dark', label: 'Dark'},
    {value: 'light', label: 'Light'},
    ]

  return (
    <div>
    <div className="navbar">
            <h1>Code Compiler</h1>
            <Select options={languages} value={lang}
                    onChange={(e) => setLang(e.value)}
                    placeholder={lang} />
            <Select options={themes} value={theme}
                    onChange={(e) => setTheme(e.value)}
                    placeholder={theme} />
        </div>
    </div>


)

}
