import { Link } from 'react-router-dom'

function Activity(props){
    return(
    <Link to = {"/"+ props.route} className='linkStyle'>
        <div className="actContainer">
            <div>
            {props.activityName}
            </div>
            <div className="courseContainer">
                {props.group}
            </div>
        </div>
    </Link>
    );
}

export default Activity;