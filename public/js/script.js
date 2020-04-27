function helperBlock(elemName) {
    $(elemName).block({ 
        message: '<i class="icon-spinner2 spinner"></i>',
        overlayCSS: {
            backgroundColor: '#fff',
            opacity: 0.8,
            cursor: 'wait',
            'box-shadow': '0 0 0 1px #ddd'
        },
        css: {
            border: 0,
            padding: 0,
            backgroundColor: 'none'
        }
    });
}

function helperUnblock(elemName) {
    $(elemName).unblock();
}

function helperModalHide() {
    $('#modal').modal('hide');
}

function helperModalShow() {
    $('#modal').modal('show');
}

function anyTimePicker(elemName) {
    $(elemName).AnyTime_picker({
        format: "%H:%i"
    });
}

function helperIonBasic(elem) {
    $(elem).ionRangeSlider();
}