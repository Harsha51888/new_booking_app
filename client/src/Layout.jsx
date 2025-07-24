import Header from './pages/Header.jsx';
import { Outlet } from 'react-router-dom';

export default function Layout(){
    return(
        <div className="px-0 md:px-0 flex flex-col min-h-screen w-full bg-gray-50">
            <Header />
            <main className="flex-1 w-full max-w-none px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
                <Outlet />
            </main>
        </div>
    )
}