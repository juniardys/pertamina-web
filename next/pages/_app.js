import React from "react";
import App from "next/app";
import { Provider } from "react-redux";
import { initStore } from "~/redux/store";
import Script from "~/components/Script"
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

        return { pageProps };
    }

    render() {
        const { Component, pageProps } = this.props;
        return (
            <Provider store={initStore}>
                <Component {...pageProps} />
                <Script />
            </Provider>
        );
    }
}


export default MyApp;