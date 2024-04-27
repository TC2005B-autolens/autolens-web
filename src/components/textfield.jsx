import './textfield.css'

function TextField(props){
    if(props.type == "title"){
    return(
        <input type="title" className={`text-input ${props.type}`} placeholder= {props.placeholder}/>
    );
    }
    else if (props.type == "desc"){
        return(
            <textarea className={`text-input ${props.type}`} cols="30" rows="10" placeholder ={props.placeholder}></textarea>
        );
    }
}

export default TextField;