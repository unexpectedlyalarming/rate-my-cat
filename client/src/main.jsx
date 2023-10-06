import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Routers from './routers.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(

    <StrictMode>
        <Routers />
    </StrictMode>
);