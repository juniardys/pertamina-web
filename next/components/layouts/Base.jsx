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
		const breadcrumb = this.props.breadcrumb || []
		return (
			<div className="BaseLayout">
				<Head title={this.props.title} />
				<Navbar />
				<div className="page-container">
					<div className="page-content">
						<Sidebar />
						<div className="content-wrapper">

							<div className="page-header page-header-default">
								<div className="page-header-content">
									<div className="page-title">
										<h4><span className="text-semibold">{ this.props.title }</span></h4>
									</div>

									<div className="heading-elements">
										{/* <div className="heading-btn-group">
											<a href="#" className="btn btn-link btn-float has-text"><i className="icon-bars-alt text-primary"></i><span>Statistics</span></a>
											<a href="#" className="btn btn-link btn-float has-text"><i className="icon-calculator text-primary"></i> <span>Invoices</span></a>
											<a href="#" className="btn btn-link btn-float has-text"><i className="icon-calendar5 text-primary"></i> <span>Schedule</span></a>
										</div> */}
									</div>
								</div>

								<Breadcrumb data={this.props.breadcrumb} />
							</div>
							<div className="content">
								<div className="row">
								{this.props.children}
								</div>
								<div className="footer text-muted">
									&copy; 2020. <a href="#">Pertamina</a> by <a href="https://nalarnaluri.com" target="_blank">Nalar Naluri</a>
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