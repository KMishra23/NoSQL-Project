import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button } from "reactstrap";
export default function Home() {
	const [collectionList,setList]=useState([]);
	const deleteCollection= (name)=>{
		fetch(`http://localhost:5050/collections/${name}`, {
      method: "DELETE"
    });
  
    const newCollections = collectionList.filter((el) => el.name !== name);
		console.log(newCollections)
    setList(newCollections);
	}
	const collectionListView=()=>{
		return collectionList.map((collection)=>{
			return (<tr key={collection.info.uuid}>
				<td><Link to={`/${collection.name}`}>{collection.name}</Link></td>
				<td><Button color="danger" onClick={()=>deleteCollection(collection.name)}>Delete</Button></td>
				</tr>)
		})
	}
	useEffect(()=>{
		const getCollections= async()=>{
			const response=await fetch(`http://localhost:5050/collections/`);
			if(!response.ok){
				console.log(response.statusText);
				return;
			}
			const collections=await response.json();
			setList(collections);
		}
		getCollections();
		collectionListView()
		return;
	},[collectionList.length])
 return (
   <div>
     <h2><Badge className="text" color="success" pill>
			List of uploaded datasets
			</Badge>
			</h2>
			<h5><Badge className="text-dark m-1" color="info" pill>
				Click on any collection to view them
			</Badge></h5>
     <table className="table table-striped" style={{ marginTop: 20, alignItems: "center" }}>
       <thead>
         <tr>
           <th>Collections</th>
         </tr>
       </thead>
       <tbody>
				{collectionListView()}
				</tbody>
     </table>
   </div>
 );
}