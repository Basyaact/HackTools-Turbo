import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-chrome-extension-router';
import { FloatButton } from 'antd';
import { QueryClientProvider, QueryClient } from 'react-query';
import LayoutApp from './components/LayoutApp';
import ReverseShell from './components/linux/ReverseShell';
import './assets/css/style.css';
import 'antd/dist/antd.css';
import 'antd/dist/antd.variable.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const queryClient = new QueryClient();

const App = () => {
    return (
        <div>
            <ReverseShell />
        </div>
    );
};


ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <LayoutApp>
            <Router>
                <App />
            </Router>
            <FloatButton.BackTop />
        </LayoutApp>
    </QueryClientProvider>,
    document.getElementById( 'app' )
);
