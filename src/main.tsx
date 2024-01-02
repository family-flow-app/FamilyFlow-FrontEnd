// File Name: main.tsx
// Developer: @yannick-leguennec (GitHub username)

import React, { Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import './styles/index.scss';
import './styles/globalStyles.scss';
import '@mantine/core/styles.css'; // Styles de base de Mantine
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/dates/styles.css';

import HeaderSimple from './components/Header/Header';
import FooterCentered from './components/Footer/FooterCentered';
import {
  UserProvider,
  useUser,
} from './context/UserInfoContext/UserInfoContext';
import PageLoader from './components/Loader/PageLoader';
import AppLoader from './components/Loader/AppLoader';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import UserStatusUpdater from './components/UserStatusUpdater/UserStatusUpdater';

const Home = React.lazy(() => import('./pages/Home/Home'));
const Login = React.lazy(() => import('./pages/Login/Login'));
const Main = React.lazy(() => import('./pages/Main/Main'));
const SignUp = React.lazy(() => import('./pages/SignUp/SignUp'));
const MyProfile = React.lazy(() => import('./pages/MyProfile/MyProfile'));
const CreateFamily = React.lazy(
  () => import('./pages/CreateFamily/CreateFamily')
);
const CreateActivity = React.lazy(
  () => import('./pages/CreateActivity/CreateActivity')
);
const Contact = React.lazy(() => import('./pages/Contact/Contact'));
const LegalMentions = React.lazy(
  () => import('./pages/LegalMentions/LegalMentions')
);
const Terms = React.lazy(() => import('./pages/Terms/Terms'));
const FamilyProfile = React.lazy(
  () => import('./pages/FamilyProfile/FamilyProfile')
);
const MemberProfile = React.lazy(
  () => import('./pages/MemberProfile/MemberProfile')
);
const ActivityDetails = React.lazy(
  () => import('./pages/ActivityDetails/ActivityDetails')
);
const About = React.lazy(() => import('./pages/About/About'));
const NothingFoundBackground = React.lazy(() => import('./pages/404/404'));
const ServerError = React.lazy(() => import('./pages/500/500'));
const ServerOverload = React.lazy(() => import('./pages/503/503'));

function App() {
  const [appLoading, setAppLoading] = useState(true);
  const { user } = useUser();

  // Vérifie si l'utilisateur est connecté et a un rôle autorisé
  const isUserAuthorized =
    user && user.role && ['user', 'member', 'admin'].includes(user.role);

  useEffect(() => {
    // Simulez le chargement initial de l'application ou effectuez des opérations de démarrage ici
    const timer = setTimeout(() => setAppLoading(false), 3000); // Ajustez selon les besoins
    return () => clearTimeout(timer);
  }, []);

  if (appLoading) {
    return <AppLoader />; // Affichez le loader d'application lors du premier chargement
  }

  return (
    <Router>
      <UserStatusUpdater />
      <ScrollToTop />
      {isUserAuthorized && <HeaderSimple />}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/about"
          element={
            <Suspense fallback={<PageLoader />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<PageLoader />}>
              <Contact />
            </Suspense>
          }
        />
        <Route
          path="/legals"
          element={
            <Suspense fallback={<PageLoader />}>
              <LegalMentions />
            </Suspense>
          }
        />
        <Route
          path="/terms"
          element={
            <Suspense fallback={<PageLoader />}>
              <Terms />
            </Suspense>
          }
        />
        <Route
          path="/404"
          element={
            <Suspense fallback={<PageLoader />}>
              <NothingFoundBackground />
            </Suspense>
          }
        />
        <Route
          path="/500"
          element={
            <Suspense fallback={<PageLoader />}>
              <ServerError />
            </Suspense>
          }
        />
        <Route
          path="/503"
          element={
            <Suspense fallback={<PageLoader />}>
              <ServerOverload />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader />}>
              <NothingFoundBackground />
            </Suspense>
          }
        />
        {/* Routes for 'visitor' */}
        <Route element={<ProtectedRoute allowedRoles={['visitor']} />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense fallback={<PageLoader />}>
                <SignUp />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<PageLoader />}>
                <Login />
              </Suspense>
            }
          />
        </Route>
        {/* Protected Routes for 'user', 'member', and 'admin' */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['user', 'member', 'admin']} />
          }
        >
          <Route
            path="/main"
            element={
              <Suspense fallback={<PageLoader />}>
                <Main />
              </Suspense>
            }
          />
          <Route
            path="/my-profile"
            element={
              <Suspense fallback={<PageLoader />}>
                <MyProfile />
              </Suspense>
            }
          />
        </Route>
        {/* Protected Routes for 'user' */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route
            path="/create-family"
            element={
              <Suspense fallback={<PageLoader />}>
                <CreateFamily />
              </Suspense>
            }
          />
        </Route>
        {/* Protected Routes for 'member' and 'admin' */}
        <Route element={<ProtectedRoute allowedRoles={['member', 'admin']} />}>
          <Route
            path="/create-activity"
            element={
              <Suspense fallback={<PageLoader />}>
                <CreateActivity />
              </Suspense>
            }
          />
          <Route
            path="/my-family"
            element={
              <Suspense fallback={<PageLoader />}>
                <FamilyProfile />
              </Suspense>
            }
          />
          <Route
            path="/member-profile/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <MemberProfile />
              </Suspense>
            }
          />
          <Route
            path="/activities/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <ActivityDetails />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      <FooterCentered />
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        fontFamily: 'Varela Round, Roboto, sans-serif',
      }}
    >
      <UserProvider>
        <App />
      </UserProvider>
    </MantineProvider>
  </React.StrictMode>
);

