
import { Link } from 'react-router-dom';
import "./Search.css";

const Search = () => {

  return (
    <div className="containerSearch">
      <Link to="/Register" style={{ textDecoration: 'none', color: 'inherit',fontSize:'25px' }}>Registrar Usuario</Link>
    </div>
  );
};

export default Search;
