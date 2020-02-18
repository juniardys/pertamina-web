import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";

class Index extends Component {
    render() {
        return (
            <Layout>
                ini test
                
                <div className="panel panel-flat">
					<div className="panel-heading">
						<h5 className="panel-title">Simple panel<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
						<div className="heading-elements">
							<ul className="icons-list">
		                		<li><a data-action="collapse" className=""></a></li>
		                		<li><a data-action="close"></a></li>
		                	</ul>
	                	</div>
					</div>

					<div className="panel-body">
						<h6 className="text-semibold">Start your development with no hassle!</h6>
						<p className="content-group">Common problem of templates is that all code is deeply integrated into the core. This limits your freedom in decreasing amount of code, i.e. it becomes pretty difficult to remove unnecessary code from the project. Limitless allows you to remove unnecessary and extra code easily just by removing the path to specific LESS file with component styling. All plugins and their options are also in separate files. Use only components you actually need!</p>

						<h6 className="text-semibold">What is this?</h6>
						<p className="content-group">Starter kit is a set of pages, useful for developers to start development process from scratch. Each layout includes base components only: layout, page kits, color system which is still optional, bootstrap files and bootstrap overrides. No extra CSS/JS files and markup. CSS files are compiled without any plugins or components. Starter kit was moved to a separate folder for better accessibility.</p>

						<h6 className="text-semibold">How does it work?</h6>
						<p>You open one of the starter pages, add necessary plugins, uncomment paths to files in components.less file, compile new CSS. That's it. I'd also recommend to open one of main pages with functionality you need and copy all paths/JS code from there to your new page, it's just faster and easier.</p>
					</div>
				</div>
            </Layout>
        )
    }
}

export default Index;