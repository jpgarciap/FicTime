import React from 'react';
import { Layout } from 'react-admin';
import MyAppBar from './AdminBar';

const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;
export default MyLayout;
