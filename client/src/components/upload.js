import React, { useEffect, useState } from "react";
import {Badge, Button, List} from "reactstrap";

const Upload = () => {
  const [files, setFiles] = useState([]);

  const handleUpload = (event) => {
    const file = event.target.files;
		// console.log(event.target.files);
    setFiles([...files,...file]);
		console.log(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
		event.preventDefault();
    const file = event.dataTransfer.files;
    setFiles([...files,...file]);
  };
	const handleSubmit = async (event) => {
		event.preventDefault();
		const formData = new FormData()
		formData.append('file', files[0])
		console.log(formData)
		console.log(files)	
			await fetch ("http://localhost:5050/collections", {
			method: "POST",
			body: formData
		})
		.then(response => response.json())
		.then(data => {
			console.log(data)
		})
		.catch(error => console.error(error))
		// console.log(event)
	}

  return (
		<div>
     <h3><Badge pill color="primary">Upload your datasets for analysis</Badge></h3>
			<div>
			<List tag="ol">
			{files.map((file) => (
				<li key={file.name}>
						{file.name}</li>
			))}
			</List>
			</div>
			<div className="row mx-auto offset-1" onDragOver={handleDragOver} onDrop={handleDrop}style={{height: "80px", alignContent: "center",borderStyle: "dotted",backgroundColor: "GrayText"}}>
				<h5>Drag or choose your files to upload </h5>
    	</div>
			<div className="row mx-auto offset-1" onDrop={handleDrop}style={{height: "80px", alignContent: "center"}}>
				<label htmlFor="file" className="col-2">Upload Files</label>
				<input type="file" name="file" id="file" onChange={handleUpload} accept=".csv,.tsv" multiple className="col-3"/>
			</div>
				<div className="row mx-auto offset-1">
			<Button className="col-2" onClick={handleSubmit} style={{margin: "10px"}} >Submit</Button>
				</div>
		</div>
  );
}

	export default Upload;