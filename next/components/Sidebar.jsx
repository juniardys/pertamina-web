import React, { Component } from 'react'
import Link from 'next/link'

const Sidebar = () => {
	const datas = [
		{
			type: 'menu',
			title: 'Dashboard',
			icon: 'icon-home',
			url: '/'
		},
		{
			type: 'menu',
			title: 'User Management',
			icon: 'icon-users',
			url: '/user'
		},
		{
			type: 'menu',
			title: 'Role Management',
			icon: 'icon-tree5',
			url: '/role'
		},
		{
			type: 'menu',
			title: 'Company',
			icon: 'icon-office',
			url: '/company'
		},
		{
			type: 'menu',
			title: 'SPBU',
			icon: 'icon-library2',
			url: '/spbu'
		},
		// {
		// 	type: 'dropdown',
		// 	title: 'Sub Manu',
		// 	icon: null,
		// 	url: '#',
		// 	sub: [
		// 		{
		// 			title: 'ini Sub Menu 1',
		// 			url: '#'
		// 		},
		// 		{
		// 			title: 'ini Sub Menu 2',
		// 			url: '#'
		// 		}
		// 	]
		// }
	]

	return (
		<div className="sidebar sidebar-main">
			<div className="sidebar-content">
				<div className="sidebar-category sidebar-category-visible">
					<div className="category-content no-padding">
						<ul className="navigation navigation-main navigation-accordion">

							<li className="navigation-header"><span>Main</span> <i className="icon-menu" title="Main pages"></i></li>
							{datas.map(menu => (
								<Link href={menu.url}>
									<li>
										<a>
											{menu.icon != null ? (<i className={menu.icon}></i>) : (<i className="icon-circle2"></i>)}
											<span>{menu.title}</span>
										</a>
										{menu.type == 'dropdown' ? (
											<ul>
												{menu.sub.map(sub => (
													<Link href={sub.url}>
														<li><a>{sub.title}</a></li>
													</Link>
												))}
											</ul>
										) : null}
									</li>
								</Link>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Sidebar;