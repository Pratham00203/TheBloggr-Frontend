import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className='d-flex justify-center align-center'>
      <div className='brand'>
        <h1>
          <Link to='/home'>TheBloggr.</Link>
        </h1>
        <p>A place to share your experiences,knowledge to the World.</p>
      </div>
    </footer>
  );
}
