import React, { Component } from 'react'
import Head from "~/components/Head";

class Auth extends Component {

	componentDidMount() {
		appCustom()
		console.log('Auth Component Mounted!');
	}

	render() {
		return (
			<div className="AuthLayout">
				<Head />
				<div className="login-container">
					<div className="navbar navbar-inverse">
						<div className="navbar-header">
							<a className="navbar-brand" href="index.html"><img src="/logo-white.png" alt="" /></a>

							<ul className="nav navbar-nav pull-right visible-xs-block">
								<li><a data-toggle="collapse" data-target="#navbar-mobile"><i className="icon-tree5"></i></a></li>
							</ul>
						</div>

						<div className="navbar-collapse collapse" id="navbar-mobile">
							{/* <ul className="nav navbar-nav navbar-right">
								<li>
									<a href="#">
										<i className="icon-display4"></i> <span className="visible-xs-inline-block position-right"> Go to website</span>
									</a>
								</li>

								<li>
									<a href="#">
										<i className="icon-user-tie"></i> <span className="visible-xs-inline-block position-right"> Contact admin</span>
									</a>
								</li>

								<li className="dropdown">
									<a className="dropdown-toggle" data-toggle="dropdown">
										<i className="icon-cog3"></i>
										<span className="visible-xs-inline-block position-right"> Options</span>
									</a>
								</li>
							</ul> */}
						</div>
					</div>

					<div className="page-container">
						<div className="page-content">
							<div className="content-wrapper">
								<div className="content">
									{this.props.children}
									<div className="footer text-muted text-center">
										&copy; 2020. <a href="#">Pertamina</a> by <a href="https://nalarnaluri.com" target="_blank">Nalar Naluri</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Auth;