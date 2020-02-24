import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";

class Index extends Component {
    render() {
		const breadcrumb = [
			{
				title: 'Account Settings',
				url: '/profile'
			}
		]

        return (
            <Layout title="Account Settings" breadcrumb={breadcrumb}>
                
            </Layout>
        )
    }
}

export default Index;