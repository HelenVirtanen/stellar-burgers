import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { router } from './components/app/app';
import { RouterProvider } from 'react-router-dom';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
