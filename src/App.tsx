import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Hero from './components/Hero';
import DishModule from './components/DishModule/DishModule';
import { ThemeContextProvider } from './context/ThemeContext';
import { ApiProvider } from './context/ApiContext';

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
      <ApiProvider>
        <AppContent />
      </ApiProvider>
    </ThemeContextProvider>
  );
};

export default App;
