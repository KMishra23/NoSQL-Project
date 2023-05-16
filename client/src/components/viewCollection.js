import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { List, Card, CardBody} from "reactstrap";
export default function ViewCollection() {
	const parameters= useParams();
	const navigate=useNavigate();
	const [documentList,setList]=useState([]);
	useEffect(()=>{
		const getDocuments= async()=>{
			const collectionName=parameters.id.toString();
			let start= new Date();
			const response=await fetch(`http://localhost:5050/collections/${collectionName}`);
			if(!response.ok){
				return;
			}
			const documents=await response.json();
			let end=new Date();
			console.log(end-start);
			setList(documents);
		}
		getDocuments();
		return;
	},[])
	const documentsView=()=>{
		const keys=Object.keys(documentList[0]);
		return (<div className="row">
		{documentList.map((document) => {
			return  (<Card body className="col-3 mx-2 my-2" key={document._id} style={{boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)'}}> 
			<CardBody>
				<List type="unstyled">
				{keys.map( (field)=>{ return <li key={field}> {field} : {document[field]}</li>})}
				</List>
				</CardBody>
			</Card>
		) })}
	</div>)}

 return (
	<div>
		<h3>Collection: {parameters.id.toString()}</h3>
		{documentList.length>0? documentsView() :""}
	</div>
 );
}