import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";

class Payment extends Component {

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
                title: 'Metode Pembayaran',
                url: `/spbu/${this.props.query.spbu}/payment`
            }
        ]


        return (
            <Layout title={'Metode Pembayaran ' + this.props.query.spbu} breadcrumb={breadcrumb}>
                ini payment {this.props.query.spbu}
            </Layout>
        )
    }
}

export default Payment;