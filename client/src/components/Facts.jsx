import React, { useCallback, useEffect } from 'react';
import axios from 'axios';

export default function Facts() {
    const [cat, setCat] = React.useState(null);

    async function getCat() {
        const res = await axios.get('https://catfact.ninja/fact');
        setCat(res.data);
    }



    useEffect(() => {
        getCat();
    }, []);



    return  (
        <div className="container cat-facts">
            <h1>Cat Facts</h1>
            <p>{cat?.fact}</p>
            
            <button onClick={getCat}>Get another fact</button>
            <p className="note">Source: <a href="https://catfact.ninja/">catfact.ninja</a></p>
        </div>
    
    )
}