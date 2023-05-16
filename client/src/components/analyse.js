import React, { useEffect, useState } from "react";
import { Badge, Button, Card,CardBody,CardTitle, CardText } from "reactstrap";


const Analyse = () => {
  const [collectionList, setList] = useState([]);
  const [collectionSelected, setColSel] = useState("");
  const [columnSel, setColumnSel] = useState("");
  const [columnList, setColumns] = useState([]);
  const [stats,setStats]=useState()

  const handleClick= async () =>{
    if(collectionSelected==="" || columnSel===""){
      return
    }
    let res="";
    let start=performance.now()
    await fetch(`http://localhost:5050/collections/${collectionSelected}/${columnSel}`)
    .then(async (response) => {
      if(response.status===200){
        res=await response.json();
      }
      else if(response.status===204){
        res={"error": "Please Choose Numerical Column"}
      }
    })
    console.log(performance.now()-start);
    setStats(res);
  }
  useEffect(() => {
    const getCollections = async () => {
      const response = await fetch(`http://localhost:5050/collections/`);
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      const collections = await response.json();
      setList(collections);
    }
    const getColumns = async () => {
      const response = await fetch(`http://localhost:5050/collections/${collectionSelected}/columns`)
      const cols = await response.json();
      setColumns(cols);
    }
    getColumns()
    getCollections();
  }, [collectionSelected])
  return (
    <>
      <div className="row my-2">
        <h2><Badge pill color="info">Analyse</Badge></h2>
      </div>
      <div className="row d-flex p-2">
        {collectionList.length > 0 ? <>
          <label htmlFor="collection" className="col-2">Choose a Collection</label>
          <select name="collection" id="collection" className="col-4" style={{ width: "300px" }} onChange={(event) => setColSel(event.target.value)} value={collectionSelected}>
            <option value="">Please select a Collection</option>
            {collectionList.map((collection) => {
              return <option key={collection.info.uuid} value={collection.name}>{collection.name}</option>
            })}
          </select>
        </>
          : "Add datasets to analyse them!"}
      </div>
      <div className="row d-flex p-2" >
        {collectionSelected !== "" ? <>
          <label htmlFor="columns" className="col-3">Choose a Column to analyse</label>
          <select name="columns" id="columns" className="col-4" style={{ width: "300px" }} onChange={(event) => setColumnSel(event.target.value)} value={columnSel}>
            <option value="">Please select a Column</option>
            {columnList.map((column) => {
              return <option key={column} value={column}>{column}</option>
            })}
          </select>
          <div className="col-2">
          <Button color="success" size="sm" onClick={handleClick}> Get Stats!</Button>
          </div>
        </>
          : ""}
      </div>
      <div className="row d-flex p-5">
            {stats!==undefined?<>
              <Card style={{ width: '20rem'}} >
            <CardBody>
              <CardTitle tag="h5">
                Stats for column {columnSel}
              </CardTitle>
              <ul>
               {Object.keys(stats).map((keey) => {
                return <li key={keey}> {keey}: {stats[keey]}</li>
               })}
              </ul>
            </CardBody>
          </Card>
            </> :""}
      </div>
    </>
  );
}

export default Analyse;