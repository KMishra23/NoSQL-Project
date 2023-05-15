import React, { useEffect, useState } from "react";
import { Badge } from "reactstrap";
export default function Home() {
 return (
   <div>
     <h3><Badge className="text-dark" color="success" pill>
			List of uploaded datasets
			</Badge>
			</h3>
   </div>
 );
}