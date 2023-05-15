import React, { useEffect, useState } from "react";
import {Badge, Button, List} from "reactstrap";


const Upload = () => {
  const [files, setFiles] = useState([]);

  const handleUpload = (event) => {
    const file = event.target.files;
		// console.log(event.target.files);
    setFiles([...file]);
		console.log(file);
    // onUpload(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    const files = event.dataTransfer.files;
    // setFiles(files);
		console.log(files);
    // onUpload(files);
  };
	async function handleSubmit(event) {
		event.preventDefault();
		
		await fetch ("http://localhost:5050/record/", {
			method: "POST",
			body: files
		})

		console.log(event)
	}

  return (
		<div>
     <h3><Badge pill color="primary">Upload your datasets for analysis</Badge></h3>
			<div>
			<List>
			{files.map((file) => (
				<li key={file.name}>
						{file.name}</li>
			))}
			</List>
			</div>
			<div className="row mx-auto offset-1" onDragOver={handleDragOver} onDrop={handleDrop} >
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