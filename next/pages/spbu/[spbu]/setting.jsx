import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";

class Setting extends Component {

    static getInitialProps({ query }) {
        return { query }
    }

    render() {
        const breadcrumb = [
            {
                title: 'SPBU',
                url: '/spbu'
            },
            {
                title: 'Pengaturan',
                url: `/spbu/${this.props.query.spbu}/report`
            }
        ]
        
    
        return (
            <Layout title={'Pengaturan  ' + this.props.query.spbu} breadcrumb={breadcrumb}>
                ini pengaturan spbu {this.props.query.spbu}
            </Layout>
        )
    }
}

export default Setting;