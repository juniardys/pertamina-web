import React, { Component } from 'react'
import Head from "~/components/head";
import Navbar from "~/components/Navbar";
import Sidebar from "~/components/Sidebar";
import Breadcrumb from "~/components/Breadcrumb";

class Base extends Component {

	componentDidMount() {
		appCustom()
		console.log('Base Component Mounted!');
	}

	render() {
		return (
			<div className="BaseLayout">
				<Head />
				<Navbar />
				<div className="page-container">
					<div className="page-content">
						<Sidebar />
						<div className="content-wrapper">

							<div className="page-header page-header-default">
								<div className="page-header-content">
									<div className="page-title">
										<h4><i className="icon-arrow-left52 position-left"></i> <span className="text-semibold">Home</span> - Dashboard</h4>
									</div>

									<div className="heading-elements">
										{/* <div className="heading-btn-group">
											<a href="#" className="btn btn-link btn-float has-text"><i className="icon-bars-alt text-primary"></i><span>Statistics</span></a>
											<a href="#" className="btn btn-link btn-float has-text"><i className="icon-calculator text-primary"></i> <span>Invoices</span></a>
											<a href="#" className="btn btn-link btn-float has-text"><i className="icon-calendar5 text-primary"></i> <span>Schedule</span></a>
										</div> */}
									</div>
								</div>

								<Breadcrumb />
							</div>
							<div className="content">
								<div className="row">
								{this.props.children}
								</div>
								<div className="footer text-muted">
									&copy; 2015. <a href="#">Limitless Web App Kit</a> by <a href="http://themeforest.net/user/Kopyov" target="_blank">Eugene Kopyov</a>
								</div>

							</div>

						</div>
					</div>
				</div>

			</div>
		)
	}
}

export default Base;