import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
export default function Home() {
	const [collectionList,setList]=useState([]);
	useEffect(()=>{
		const getCollections= async()=>{
			const response=await fetch(`http://localhost:5050/collections/`);
			if(!response.ok){
				console.log(response.statusText);
				return;
			}
			const collections=await response.json();
			console.log(collections)
			setList(collections);
		}
		getCollections();
		return;
	},[])
	const collectionListView=()=>{
		return collectionList.map((collection)=>{
			return (<tr key={collection.info.uuid}>
				<td><Link to={`/${collection.name}`}>{collection.name}</Link></td>
				</tr>)
		})
	}
 return (
   <div>
     <h3><Badge className="text-dark" color="success" pill>
			List of uploaded datasets
			</Badge>
			</h3>
     <table className="table table-striped" style={{ marginTop: 20 }}>
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