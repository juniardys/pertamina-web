import React, { Component, useEffect } from 'react'
import Layout from "~/components/layouts/Base";
import { useRouter } from 'next/router'


const Index = () => {
    const router = useRouter()
    const { uuid } = router.query

    const breadcrumb = [
        {
            title: 'SPBU',
            url: '/spbu'
        },
        {
            title: 'Island',
            url: `/spbu/${uuid}/island`
        }
    ]
    

    return (
        <Layout title={'Island ' + uuid} breadcrumb={breadcrumb}>
            ini island {uuid}
        </Layout>
    )
}

export default Index;