import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Remake from './Remake';
const root=createRoot(document.getElementById('root')!);
if(import.meta.env.DEV&&new URLSearchParams(location.search).get('lab')==='weighing')import('./WeighingLab').then(({default:Lab})=>root.render(<StrictMode><Lab/></StrictMode>));
else if(import.meta.env.DEV&&new URLSearchParams(location.search).get('lab')==='archive')import('./ArchiveLab').then(({default:Lab})=>root.render(<StrictMode><Lab/></StrictMode>));
else if(import.meta.env.DEV&&['cutaway','foreedge','press'].includes(new URLSearchParams(location.search).get('lab')??''))import('./MechanismLab').then(({default:Lab})=>root.render(<StrictMode><Lab/></StrictMode>));
else root.render(<StrictMode><Remake/></StrictMode>);
