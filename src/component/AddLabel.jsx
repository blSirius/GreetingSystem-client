import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import axios from 'axios';
import NavBar from './NavBar';
import AddLabelCSS from '../style/AddLabel.module.css'

const AddLabel = () => {
  const [file, setFile] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Create a URL for the selected file and set it as the image preview
    const previewURL = URL.createObjectURL(selectedFile);
    setImagePreview(previewURL);
  };

  const handleFolderNameChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('labels', file);
    formData.append('folderName', folderName || 'defaultFolder');

    try {
      const { data } = await axios.post('http://localhost:5000/updateImageFolder', formData);
      console.log('Server response:', data);
    } catch (error) {
      console.error('Error:', error.message || 'Failed to upload image.');
    }
  };

  return (
    <>
      <NavBar />
      <Container className={AddLabelCSS.container} >
        <div style={{marginTop: '100px'}} >
          <input
            type="text"
            placeholder="Folder Name"
            value={folderName}
            className={AddLabelCSS.label_input}
            onChange={handleFolderNameChange}
          />
          <br />
          <input type="file"   onChange={handleFileChange} />
          <br />
          {imagePreview && <img src={imagePreview} alt="Selected" style={{ maxWidth: '100%' }} />}
          <br />
          <button className={AddLabelCSS.button} onClick={handleUpload}>Upload</button>
        </div>
      </Container>
    </>
  );
};

export default AddLabel;