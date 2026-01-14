import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Hero from './components/Hero';
import DishModule from './components/DishModule/DishModule';
import { ThemeContextProvider } from './context/ThemeContext';

const AppContent: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Layout>
        <Hero />
        <DishModule />
      </Layout>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
  );
};

export default App;
