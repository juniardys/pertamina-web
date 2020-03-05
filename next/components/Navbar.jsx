import React, { Component } from 'react'
import Link from 'next/link'
import { logout, checkAuth } from '~/helpers'
import { connect } from 'react-redux';
import * as actions from '~/redux/actions/profileAction';

class Navbar extends Component {
	async componentDidMount() {
		const auth = await checkAuth()
		if (auth) this.props.setProfile(auth.profile)
	}

	_tryLogout() {
		logout()
	}

	render() {
		return (
			<div className="navbar navbar-default header-highlight">
				<div className="navbar-header">
					<a className="navbar-brand" href="index.html"><img src="/logo-white.png" alt="" /></a>

					<ul className="nav navbar-nav pull-right visible-xs-block">
						<li><a data-toggle="collapse" data-target="#navbar-mobile"><i className="icon-tree5"></i></a></li>
						<li><a className="sidebar-mobile-main-toggle"><i className="icon-paragraph-justify3"></i></a></li>
						<li><a className="sidebar-mobile-secondary-toggle"><i className="icon-more"></i></a></li>
					</ul>
				</div>

				<div className="navbar-collapse collapse" id="navbar-mobile">
					<ul className="nav navbar-nav">
						<li><a className="sidebar-control sidebar-main-toggle hidden-xs"><i className="icon-paragraph-justify3"></i></a></li>
						<li><a className="sidebar-control sidebar-secondary-hide hidden-xs"><i className="icon-transmission"></i></a></li>
					</ul>

					<ul className="nav navbar-nav navbar-right">
						<li className="dropdown">
							<a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
								<i className="icon-bell2"></i>
								<span className="visible-xs-inline-block position-right">Notification</span>
								<span className="badge bg-warning-400">2</span>
							</a>

							<div className="dropdown-menu dropdown-content width-350">
								<div className="dropdown-content-heading">
									Notifikasi
							{/* <ul className="icons-list">
								<li><a href="#"><i className="icon-compose"></i></a></li>
							</ul> */}
								</div>

								<ul className="media-list dropdown-content-body">
									<li className="media">
										<div className="media-left">
											<img src="../../../../global_assets/images/placeholders/placeholder.jpg" className="img-circle img-sm" alt="" />
											<span className="badge bg-danger-400 media-badge">5</span>
										</div>

										<div className="media-body">
											<a href="#" className="media-heading">
												<span className="text-semibold">James Alexander</span>
												<span className="media-annotation pull-right">04:58</span>
											</a>

											<span className="text-muted">who knows, maybe that would be the best thing for me...</span>
										</div>
									</li>

									<li className="media">
										<div className="media-left">
											<img src="../../../../global_assets/images/placeholders/placeholder.jpg" className="img-circle img-sm" alt="" />
											<span className="badge bg-danger-400 media-badge">4</span>
										</div>

										<div className="media-body">
											<a href="#" className="media-heading">
												<span className="text-semibold">Margo Baker</span>
												<span className="media-annotation pull-right">12:16</span>
											</a>

											<span className="text-muted">That was something he was unable to do because...</span>
										</div>
									</li>

									<li className="media">
										<div className="media-left"><img src="../../../../global_assets/images/placeholders/placeholder.jpg" className="img-circle img-sm" alt="" /></div>
										<div className="media-body">
											<a href="#" className="media-heading">
												<span className="text-semibold">Jeremy Victorino</span>
												<span className="media-annotation pull-right">22:48</span>
											</a>

											<span className="text-muted">But that would be extremely strained and suspicious...</span>
										</div>
									</li>

									<li className="media">
										<div className="media-left"><img src="../../../../global_assets/images/placeholders/placeholder.jpg" className="img-circle img-sm" alt="" /></div>
										<div className="media-body">
											<a href="#" className="media-heading">
												<span className="text-semibold">Beatrix Diaz</span>
												<span className="media-annotation pull-right">Tue</span>
											</a>

											<span className="text-muted">What a strenuous career it is that I've chosen...</span>
										</div>
									</li>

									<li className="media">
										<div className="media-left"><img src="../../../../global_assets/images/placeholders/placeholder.jpg" className="img-circle img-sm" alt="" /></div>
										<div className="media-body">
											<a href="#" className="media-heading">
												<span className="text-semibold">Richard Vango</span>
												<span className="media-annotation pull-right">Mon</span>
											</a>

											<span className="text-muted">Other travelling salesmen live a life of luxury...</span>
										</div>
									</li>
								</ul>

								<div className="dropdown-content-footer">
									<a href="#" data-popup="tooltip" title="" data-original-title="Semua Notifikasi"><i className="icon-menu display-block"></i></a>
								</div>
							</div>
						</li>
						<li className="dropdown dropdown-user">
							<a className="dropdown-toggle" data-toggle="dropdown">
								<img src="../../../../global_assets/images/image.png" alt="" />
								<span>{this.props.name}</span>
								<i className="caret"></i>
							</a>

							<ul className="dropdown-menu dropdown-menu-right">
								{/* <li><a href="#"><i className="icon-user-plus"></i> My profile</a></li>
								<li><a href="#"><i className="icon-coins"></i> My balance</a></li>
								<li><a href="#"><span className="badge badge-warning pull-right">58</span> <i className="icon-comment-discussion"></i> Messages</a></li>
								<li className="divider"></li> */}
								<Link href="/profile">
									<li><a href="#"><i className="icon-cog5"></i> Pengaturan Akun</a></li>
								</Link>
								<li onClick={() => this._tryLogout()}><a href="#"><i className="icon-switch2"></i> Keluar</a></li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	name: state.profile.name
})

const mapDispatchToProps = dispatch => ({
    setProfile: (value) => dispatch(actions.setProfile(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);