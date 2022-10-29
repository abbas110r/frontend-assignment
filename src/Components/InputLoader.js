import React, { useState } from 'react';
import '../CSS/InputLoader.css';
function InputLoader(props) {
  const [file, setFile] = useState();
  const fileHandler = (event) => {
    const fileInput = event.target.files[0];
    if (fileInput) {
      setFile(fileInput);
    }
  };
  const uploadHandler = () => {
    if (file) {
      props.onUpload(file);
    }
  };
  return (
    <div className="input-container">
      <input type="file" onChange={fileHandler} className="file-input" />
      <button onClick={uploadHandler}>Upload</button>
    </div>
  );
}
export default InputLoader;
