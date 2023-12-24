import React, { useState } from 'react';

const App = () => {
  const [file, setFile] = useState(null);
  const [folderName, setFolderName] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFolderNameChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folderName', folderName || 'defaultFolder');

      try {
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Server response:', result);
        } else {
          console.error('Failed to upload image.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('Please select a file.');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <br />
      <input
        type="text"
        placeholder="Folder Name"
        value={folderName}
        onChange={handleFolderNameChange}
      />
      <br />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default App;
