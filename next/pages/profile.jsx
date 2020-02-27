import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import { checkAuth } from '~/helpers'

class Index extends Component {
    componentDidMount() {
        checkAuth()
    }
    
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