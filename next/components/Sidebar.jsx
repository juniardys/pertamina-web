import React, { Component } from 'react'

class Sidebar extends Component {
	render() {
		return (
			<div className="sidebar sidebar-main">
				<div className="sidebar-content">

					<div className="sidebar-user">
						<div className="category-content">
							<div className="media">
								<a href="#" className="media-left"><img src="../../../../global_assets/images/placeholders/placeholder.jpg" className="img-circle img-sm" alt="" /></a>
								<div className="media-body">
									<span className="media-heading text-semibold">Victoria Baker</span>
									<div className="text-size-mini text-muted">
										<i className="icon-pin text-size-small"></i> &nbsp;Santa Ana, CA
									</div>
								</div>

								<div className="media-right media-middle">
									<ul className="icons-list">
										<li>
											<a href="#"><i className="icon-cog3"></i></a>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					<div className="sidebar-category sidebar-category-visible">
						<div className="category-content no-padding">
							<ul className="navigation navigation-main navigation-accordion">

								<li className="navigation-header"><span>Main</span> <i className="icon-menu" title="Main pages"></i></li>
								<li><a href="index.html"><i className="icon-home4"></i> <span>Dashboard</span></a></li>
								<li>
									<a href="#"><i className="icon-stack2"></i> <span>Page layouts</span></a>
									<ul>
										<li><a href="layout_navbar_fixed.html">Fixed navbar</a></li>
										<li><a href="layout_navbar_sidebar_fixed.html">Fixed navbar &amp; sidebar</a></li>
										<li><a href="layout_sidebar_fixed_native.html">Fixed sidebar native scroll</a></li>
										<li><a href="layout_navbar_hideable.html">Hideable navbar</a></li>
										<li><a href="layout_navbar_hideable_sidebar.html">Hideable &amp; fixed sidebar</a></li>
										<li><a href="layout_footer_fixed.html">Fixed footer</a></li>
										<li className="navigation-divider"></li>
										<li><a href="boxed_default.html">Boxed with default sidebar</a></li>
										<li><a href="boxed_mini.html">Boxed with mini sidebar</a></li>
										<li><a href="boxed_full.html">Boxed full width</a></li>
									</ul>
								</li>
							</ul>
						</div>
					</div>

				</div>
			</div>
		)
	}
}

export default Sidebar;