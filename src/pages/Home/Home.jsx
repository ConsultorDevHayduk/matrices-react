import { useState,useEffect } from 'react';
import './Home.module.css';
import { useNavigate } from "react-router-dom";


const Home = () => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const [matrixInput, setMatrixInput] = useState(JSON.stringify([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16]
  ], null, 2));
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const exp = localStorage.getItem("token_exp");

    if (!savedToken || Date.now() > parseInt(exp)) {
      navigate("/");
    } else {
      setToken(savedToken);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const parsedMatrix = JSON.parse(matrixInput);
      const response = await fetch('http://matrixes-qr-api-env.eba-5wgxncym.us-east-2.elasticbeanstalk.com/api/factorizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ matrix: parsedMatrix }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(`Error al procesar la matriz: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatJson = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    
      
      
      <div className="editor-container" style={{ width: '100%', height: '780px',display:'flex',justifyContent:'space-around',marginTop:'50px'}}
>
        <div className="input-section" style={{display:'flex',flexDirection:'column', width:'50%',height:'700px',alignItems:'center'}}>
          <h2>Input Matrix</h2>
          <textarea
            className="matrix-input"
            value={matrixInput}
            onChange={(e) => setMatrixInput(e.target.value)}
            placeholder="Ingresa tu matriz en formato JSON"
            spellCheck="false"
            style={{height:'420px',width:'300px'}}
          />
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="submit-button"
            style={{marginTop:'20px'}}
          >
            {isLoading ? 'Processing...' : 'Procesa Matriz'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="output-section" style={{display:'flex',flexDirection:'column', width:'50%',height:'700px',alignItems:'center'}} >
          <h2>Results</h2>
          {results ? (
            <div className="results-container" style={{display:'flex'}}>
              <div className="stats-section">
                <h3>Statistics</h3>
                <table className="stats-table">
                  <tbody>
                    <tr>
                      <td>Max Value:</td>
                      <td>{results.data.max.toFixed(4)}</td>
                    </tr>
                    <tr>
                      <td>Min Value:</td>
                      <td>{results.data.min.toFixed(4)}</td>
                    </tr>
                    <tr>
                      <td>Promedio:</td>
                      <td>{results.data.average.toFixed(4)}</td>
                    </tr>
                    <tr>
                      <td>Sum:</td>
                      <td>{results.data.sum.toFixed(4)}</td>
                    </tr>
                    <tr>
                      <td>Is Diagonal:</td>
                      <td>{results.data.isDiagonal ? 'Yes' : 'No'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="matrices-section" style={{display:'flex'}}>
                <div className="matrix-group" style={{marginLeft:'50px'}}>
                  <h4>Matrix Q</h4>
                  <pre className="matrix-output">
                    {formatJson(results.payload.Q)}
                  </pre>
                </div>
                <div className="matrix-group" style={{marginLeft:'40px'}}>
                  <h4>Matrix R</h4>
                  <pre className="matrix-output">
                    {formatJson(results.payload.R)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-results">
              {isLoading ? 'Processing matrix...' : 'Los resultados se mostraran aqui'}
            </div>
          )}
        </div>
      </div>
    
  );
};

export default Home;