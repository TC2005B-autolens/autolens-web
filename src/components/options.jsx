import React, {useState} from 'react';
import './options.css'

function Options(props){

    const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    onSelect(language);
  };

  const optionStyle = isSelected ? { backgroundColor: 'blue' } : {};

    if (props.language == "Python")
    return(
        <div className="option" onClick={handleClick} style={optionStyle}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png" alt="" />
            <h1>{props.language}</h1>
        </div>
    );
    else if(props.language == "C++" )
    return(
        <div className="option" onClick={handleClick} style={optionStyle}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/1822px-ISO_C%2B%2B_Logo.svg.png" alt="" />
            <h1>{props.language}</h1>
        </div>
    );
    else if(props.language == "Java")
    return(
        <div className="option" onClick={handleClick}style={optionStyle}>
        <img src="https://cdn-icons-png.flaticon.com/512/226/226777.png" alt="" />
        <h1>{props.language}</h1>
    </div>
    );
}

export default Options;