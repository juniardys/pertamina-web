import React, { Component } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const SubSidebar = () => {
	const router = useRouter()

	if (router.pathname.includes('/spbu/[spbu]')) {
		const { spbu } = router.query

		const datas = [
			{
				type: 'menu',
				title: 'Dashboard',
				icon: 'icon-home2',
				url: '/spbu/' + spbu
			},
			{
				type: 'menu',
				title: 'User',
				icon: 'icon-users',
				url: `/spbu/${spbu}/user/`
			},
			{
				type: 'menu',
				title: 'Shift',
				icon: 'icon-alarm-check',
				url: '/shift'
			},
			{
				type: 'menu',
				title: 'Island',
				icon: 'icon-grid-alt',
				url: `/spbu/${spbu}/island/`
			},
			{
				type: 'menu',
				title: 'Payment Method',
				icon: ' icon-coin-dollar',
				url: `/spbu/${spbu}/payment/`
			},
			// {
			// 	type: 'menu',
			// 	title: 'Transaction',
			// 	icon: ' icon-transmission',
			// 	url: `/spbu/${spbu}/transaction/`
			// },
			// {
			// 	type: 'dropdown',
			// 	title: 'Island',
			// 	icon: 'icon-grid-alt',
			// 	url: '#',
			// 	sub: [
			// 		{
			// 			title: 'Product',
			// 			url: '#'
			// 		},
			// 		{
			// 			title: 'Tank',
			// 			url: '#'
			// 		},
			// 		{
			// 			title: 'Nozzle',
			// 			url: '#'
			// 		}
			// 	]
			// },
		]

		return (
			<div className="sidebar sidebar-secondary sidebar-default">
				<div className="sidebar-content">
					<div className="sidebar-category">
						<div className="category-content no-padding">
							<ul className="navigation navigation-alt navigation-accordion">
								<li className="navigation-header"><span>SPBU Menu</span> <i className="icon-menu" title="Main pages"></i></li>
								{datas.map((menu, i) => (
									<Link href={menu.url} key={i}>
										<li>
											<a>
												{menu.icon != null ? (<i className={menu.icon}></i>) : (<i className="icon-circle2"></i>)}
												<span>{menu.title}</span>
											</a>
											{menu.type == 'dropdown' ? (
												<ul>
													{menu.sub.map((sub, subi) => (
														<Link href={sub.url} key={subi}>
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
	} else {
		return null
	}
}

export default SubSidebar;