import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const MainLayout = () => {
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            backgroundColor: 'var(--light-gray)' 
        }}>
            
            <Header />
            
           
            <main style={{ 
                flex: 1, 
                padding: '20px',
                width: '100%',
                maxWidth: '1200px', 
                margin: '0 auto'    
            }}>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;