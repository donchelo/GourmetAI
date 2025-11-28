import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Hero from './components/Hero';
import DishModule from './components/DishModule/DishModule';
import { ThemeContextProvider } from './context/ThemeContext';

function AppContent() {
  return (
    <>
      <CssBaseline />
      <Layout>
        <Hero />
        <DishModule />
      </Layout>
    </>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
  );
}

export default App;
