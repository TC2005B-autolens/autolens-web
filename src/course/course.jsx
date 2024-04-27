import './course.css';

function Course() {
    return (
      <>
        <div className="body">
        <div className='titlecourse'>
          <h1>Construcción de software y toma de decisiones</h1>
        </div>
        <div className="content">
          
        <div className='activities'>
          <div>
          <h2>Tareas recientes</h2>
          </div>
          <div className="actcontainers">
          <div class="actividad">Actividad 1</div>
          <div class="actividad">Actividad 2</div>
          <div class="actividad">Actividad 1</div>
          <div class="actividad">Actividad 2</div>
          </div>
        </div>
        <div className='users'>
          <div className="title">
          <h2>Alumnos</h2>
          </div>
          <div class="usuario">
            <div className="userimage">
            <img src="https://img.icons8.com/metro/52/user-male-circle.png" />
            </div>
            Usuario 1
          </div>
          <div class="usuario">
            <div className="userimage">
            <img src="https://img.icons8.com/metro/52/user-male-circle.png" />
            </div>
            Usuario 1
          </div>
          <div class="usuario">
            <div className="userimage">
            <img src="https://img.icons8.com/metro/52/user-male-circle.png" />
            </div>
            Usuario 1
          </div>
          <div class="usuario">
            <div className="userimage">
            <img src="https://img.icons8.com/metro/52/user-male-circle.png" />
            </div>
            Usuario 1
          </div>
          <div class="usuario">
            <div className="userimage">
            <img src="https://img.icons8.com/metro/52/user-male-circle.png" />
            </div>
            Usuario 1
          </div>
          </div>
        </div>
        </div>
        </>
        );
    }

    export default Course;