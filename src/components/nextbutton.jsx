import {Link} from 'react-router-dom';

function NextButton(props){
    return(
        <Link className='linkStyle' to={'/'+ props.route}>
        <div style={{backgroundColor: '#d9d9d9',
        width: '30vh',
        height: '5vh', 
        borderRadius:'8px',
        border:'1px solid #000',
        padding: '5px',
        display:'flex',
        justifyContent:"center",
        alignItems:'center',
        font: '700 15px League Spartan, -apple-system, Roboto, Helvetica,sans-serif'}} className="nextButton">
            {props.text}
        </div>
        </Link>
    );
}

export default NextButton;