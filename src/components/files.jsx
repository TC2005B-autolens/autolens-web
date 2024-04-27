import React from 'react';

function Files(props) {
  if(props.language == "Python")
    return (
    <div className="filesComp">
        <div className="content">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png" alt="Python Logo"/>
      </div>
      <p>{props.fileName}</p>
    </div>
  );
  else if(props.language == "C++")
  return(
    <div className="filesComp">
        <div className="content">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/1822px-ISO_C%2B%2B_Logo.svg.png" alt="C++ Logo"/>
      </div>
      <p>{props.fileName}</p>
    </div>
    );
    else if(props.language == "Java")
    return(
        <div className="filesComp">
        <div className="content">
      <img src="https://cdn-icons-png.flaticon.com/512/226/226777.png" alt="Java Logo"/>
      </div>
      <p>{props.fileName}</p>
    </div>
    );
    else
    return(
        <div className="filesComp">
        <div className="content">
      <img src="https://cdn-icons-png.flaticon.com/512/3416/3416075.png"/>
      </div>
    </div>
    );
}

export default Files;
