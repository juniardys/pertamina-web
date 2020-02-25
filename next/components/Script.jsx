import React, { Component } from 'react'

class Script extends Component {
    render() {
        return (
            <div className="ScriptContainer">
                <script src="/global_assets/js/plugins/loaders/pace.min.js"></script>
                <script src="/global_assets/js/core/libraries/jquery.min.js"></script>
                <script src="/global_assets/js/core/libraries/bootstrap.min.js"></script>
                <script src="/global_assets/js/plugins/loaders/blockui.min.js"></script>
                {/* <script src="assets/js/app.js"></script> */}
                <script src="/js/app-custom.js"></script>

                {/* Theme JS */}
                <script src="/global_assets/js/plugins/notifications/bootbox.min.js"></script>
                <script src="/global_assets/js/plugins/notifications/sweet_alert.min.js"></script>
                <script src="/global_assets/js/plugins/forms/selects/select2.min.js"></script>

                <script src="/global_assets/js/demo_pages/components_modals.js"></script>

                <script src="/global_assets/js/plugins/ui/moment/moment.min.js"></script>
                <script src="/global_assets/js/plugins/pickers/daterangepicker.js"></script>
                <script src="/global_assets/js/plugins/pickers/anytime.min.js"></script>
                <script src="/global_assets/js/plugins/pickers/pickadate/picker.js"></script>
                <script src="/global_assets/js/plugins/pickers/pickadate/picker.date.js"></script>
                <script src="/global_assets/js/plugins/pickers/pickadate/picker.time.js"></script>
                <script src="/global_assets/js/plugins/pickers/pickadate/legacy.js"></script>
                <script src="/js/script.js"></script>
            </div>
        )
    }
}

export default Script;