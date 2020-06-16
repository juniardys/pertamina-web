import React, { Component } from 'react'
import Link from 'next/link'
import { logout, checkAuth } from '~/helpers'
import { connect } from 'react-redux';
import * as actions from '~/redux/actions/profileAction';
import { get } from '~/helpers/request'
import { toast } from '~/helpers'

class Navbar extends Component {
	constructor(props) {
		super(props)
		this.state = {
			unReadNotif: 0,
			limit: 3,
			page: 1,
			notifications: [],
			isLoading: true,
			lastPage: 1
		}
	}

	async componentDidMount() {
		const auth = await checkAuth()

		if (auth) {
			this.props.setProfile(auth.profile)
			this._getUnreadNotif()
		}
		
	}

	async _getUnreadNotif() {
		const count = await get('/notification/count-unread')
		if (count.success) await this.setState({ unReadNotif: count.data.count })
	}

	async _getMoreNotification(page = 1) {
		await this.setState({ page: page, isLoading: true })
		const data = await get('/notification', {
			page: this.state.page,
			paginate: this.state.limit,
			order_col: "created_at:desc"
		})
		if (data.success) {
			let notifications = []
			if (this.state.page > 1) {
				notifications = [...this.state.notifications, ...data.data.data]
			} else {
				notifications = data.data.data
			}
			await this.setState({ notifications: notifications, isLoading: false, lastPage: data.data.pagination.lastPage })
			await this._getUnreadNotif()
		}
	}

	async _getNotification(page) {
		if (this.state.lastPage > this.state.page) {
			this._getMoreNotification(page)
		} else {
			toast.fire({ icon: 'info', title: 'Semua Notifikasi sudah tampil' })
		}
	}

	_tryLogout() {
		logout()
	}

	renderNotif() {
		if (this.state.notifications.length == 0) {
			return (<center>Notifikasi Belum ada</center>)
		} else {
			return (
				this.state.notifications.map((item, i) => (
					<li className="media" key={i}>
						<div className="media-left">
							<img src="../../../../global_assets/images/placeholders/placeholder.jpg" className="img-circle img-sm" alt="" />
							{(!item.is_read) ? (<span className="badge bg-danger-400 media-badge"><span style={{ color: 'transparent' }}>1</span></span>) : null}
						</div>

						<div className="media-body">
							<a href="#" className="media-heading">
								<span className="text-semibold">{item.title}</span>
								<span className="media-annotation pull-right">04:58</span>
							</a>

							<span className="text-muted">{item.body}</span>
						</div>
					</li>
				))
			)
		}
	}

	render() {
		return (
			<div className="navbar navbar-default header-highlight">
				<div className="navbar-header">
					<Link href="/">
						<a className="navbar-brand" href=""><img src="/image/logo-white.png" alt="Pertamina" style={{ marginTop: '-8px', height: '32px' }} /></a>
					</Link>

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
							<a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false" onClick={() => this._getMoreNotification()}>
								<i className="icon-bell2"></i>
								<span className="visible-xs-inline-block position-right">Notification</span>
								<span className="badge bg-warning-400">{this.state.unReadNotif}</span>
							</a>

							<div className="dropdown-menu dropdown-content width-350">
								<div className="dropdown-content-heading">
									Notifikasi
									<ul className="icons-list">
										{/* <li><a href="#">Mark All as Read</a></li> */}
									</ul>
								</div>

								<ul className="media-list dropdown-content-body">
									{(this.state.isLoading) ? ("loading") : this.renderNotif()}
								</ul>

								<div className="dropdown-content-footer">
									<a href="#" data-popup="tooltip" title="" data-original-title="Lebih banyak Notifikasi" onClick={() => this._getNotification(this.state.page + 1)}><i className="icon-menu display-block"></i></a>
								</div>
							</div>
						</li>
						<li className="dropdown dropdown-user">
							<a className="dropdown-toggle" data-toggle="dropdown">
								<img src={(this.props.image) ? this.props.image : "/image/avatar.jpg"} alt="" />
								<span>{(this.props.name) ? this.props.name : "Undefined User"}</span>
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
	name: state.profile.name,
	image: state.profile.image
})

const mapDispatchToProps = dispatch => ({
	setProfile: (value) => dispatch(actions.setProfile(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);