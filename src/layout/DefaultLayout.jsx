import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';


const DefaultLayout = ({ children,setIsAuthenticated }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setPageTitle('Dashboard');
        break;
      case '/buyer-management':
        setPageTitle('Buyer Management');
        break;
      case '/seller-management':
        setPageTitle('Seller Management');
        break;
      case '/product-management':
        setPageTitle('Product Management');
        break;
      case '/order-management':
        setPageTitle('Order Management');
        break;
      case '/payment-management':
        setPageTitle('Payment Management');
        break;
        case '/chat':
        setPageTitle('Message ');
        break;
      default:
        setPageTitle('');
    }
  }, [location.pathname]);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setIsAuthenticated={setIsAuthenticated}/>
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} pageTitle={pageTitle} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
