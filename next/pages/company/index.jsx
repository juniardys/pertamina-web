import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";

class Index extends Component {
    render() {
		const breadcrumb = [
			{
				title: 'Company',
				url: '/company'
			}
		]

        return (
            <Layout title="Company" breadcrumb={breadcrumb}>
                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">List Company <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <ul className="icons-list">
                                <li><a data-action="collapse"></a></li>
                                <li><a data-action="reload"></a></li>
                                {/* <li><a data-action="close"></a></li> */}
                            </ul>
                        </div>
                    </div>

                    <div className="panel-body">
                        <ul className="media-list">
                            <li className="media">
                                <div className="media-left media-middle">
                                    <a href="#">
                                        <img src="../../../../global_assets/images/placeholders/placeholder.jpg" className="img-circle img-md" alt="" />
                                    </a>
                                </div>

                                <div className="media-body">
                                    <div className="media-heading text-semibold">PT Kayu Mati</div>
                                    <span className="text-muted">Malang, Jawa Timur, Indonesia</span>
                                </div>

                                <div className="media-right media-middle">
                                    <ul className="icons-list icons-list-extended text-nowrap">
                                        <li><a href="#" data-popup="tooltip" title="" data-toggle="modal" data-target="#profile" data-original-title="Detail"><i className="icon-profile"></i></a></li>

                                        <li><a href="#" data-popup="tooltip" title="" data-toggle="modal" data-target="#edit" data-original-title="Edit"><i className="icon-pencil7"></i></a></li>

                                        <li><a href="#" data-popup="tooltip" title="" data-toggle="modal" data-target="#delete" data-original-title="Delete"><i className="icon-trash"></i></a></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Index;