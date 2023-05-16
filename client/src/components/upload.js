import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Badge, Button, List} from "reactstrap";

const Upload = () => {
  const [files, setFiles] = useState([]);
	const [filesAdded,toggle] = useState(false);
  const handleUpload = (event) => {
    const file = event.target.files;
    setFiles([...files,...file]);
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
		let allfiles=true;
		for(var i = 0; i < files.length; i++) {
			const formData = new FormData()
			formData.append('file', files[i])
			let start=new Date();
			await fetch ("http://localhost:5050/collections", {
				method: "POST",
				body: formData
			})
			.then(response => response.json())
			.then(data => {
				if(data.message==="collection inserted"){
					allfiles&=true;
				}
				else if(data.message==="collection with same file name exists!"){
					setFiles([]);
					const inpputelement=document.getElementById("file")
					inpputelement.value="";
					window.alert(data.message)
				}
			})
			.catch(error => {
				console.error(error)
				allfiles&=false;
			})
			let end=new Date();
			console.log(end-start);
		}
		if(allfiles===1){
			setFiles([]);
			toggle(!filesAdded);
		}
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
				{filesAdded?<div className="row mx-auto offset-1">
					<p>
						All files inserted! View them <Link to="/">here</Link></p>
				</div>:""}
		</div>
  );
}

	export default Upload;