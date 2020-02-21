import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";

class Report extends Component {

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
                title: 'Laporan',
                url: `/spbu/${this.props.query.spbu}/report`
            }
        ]
        
    
        return (
            <Layout title={'Laporan  ' + this.props.query.spbu} breadcrumb={breadcrumb}>
                ini laporan spbu {this.props.query.spbu}
            </Layout>
        )
    }
}

export default Report;