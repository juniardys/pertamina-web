import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";

class Index extends Component {
    render() {
		const breadcrumb = [
			{
				title: 'SPBU',
				url: '/spbu'
			}
		]

        return (
            <Layout title="SPBU" breadcrumb={breadcrumb}>
                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">List SPBU<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <ul className="icons-list">
                                <li><a data-action="collapse" className=""></a></li>
                                <li><a data-action="reload"></a></li>
                                <li><a data-action="close"></a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="panel-body">
                        Example of a table with <code>striped</code> rows. Use <code>.table-striped</code> added to the base <code>.table</code> class to add zebra-striping to any table odd row within the <code>&lt;tbody&gt;</code>. This styling doesn't work in IE8 and lower as <code>:nth-child</code> CSS selector isn't supported in these browser versions. Striped table can be combined with other table styles.
						</div>

                    <div className="table-responsive">
                    <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Code</th>
                                    <th>Phone</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Pertamina G-WALK</td>
                                    <td>Q1W2E3R4</td>
                                    <td>0851326718</td>
                                    <td>
                                        <button type="button" class="btn btn-brand btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Detail"><i class="icon-library2"></i></button>
                                        <button type="button" class="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit"><i class="icon-pencil7"></i></button>
                                        <button type="button" class="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete"><i class="icon-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Index;