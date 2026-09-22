import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Remake from './Remake';
const root=createRoot(document.getElementById('root')!);
root.render(<StrictMode><Remake/></StrictMode>);
