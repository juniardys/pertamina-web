import React, { Component } from 'react'
import { toast } from '~/helpers'
import axios from 'axios'
import { connect } from 'react-redux';
import { setProfile } from '~/redux/actions/profileAction';
import { setUser } from '~/redux/actions/userAction';
import ReactAvatarEditor from 'react-avatar-editor'
import { update } from '~/helpers/request'

class ChangeUserImage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image: '',
            position: { x: 0.5, y: 0.5 },
            scale: 1,
            rotate: 0,
            borderRadius: 0,
            width: 200,
            height: 200,
        }
    }

    componentDidMount() {
        $(".file-styled").uniform({
            fileButtonClass: 'action btn btn-default'
        });
    }

    handleNewImage = e => {
        this.setState({ image: e.target.files[0] })
    }

    handleSave = async data => {
        const img = this.editor.getImageScaledToCanvas()
        // const rect = this.editor.getCroppingRect()
        const btnImg = Ladda.create(document.querySelector('.btn-image-spinner'))
        btnImg.start()
        const myThis = this
        img.toBlob(async (blob) => {
            if (myThis.props.uuid === undefined) {
                await myThis._sendProfileImage(blob, btnImg)
            } else {
                await myThis._sendUserImage(blob, btnImg)
            }
        })
    }

    _sendProfileImage = async (blob, btnImg) => {
        const formData = new FormData();
        formData.append('phone', this.props.profile.phone);
        formData.append('address', this.props.profile.address);
        formData.append('ktp', this.props.profile.ktp);
        formData.append('image', blob, this.state.image.name);

        // Post via axios or other transport method
        await axios.post(`/api/v1/profile?api_key=${process.env.APP_API_KEY}`, formData, { headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` } })
            .then(response => {
                const data = response.data.data
                this.props.setProfile({
                    name: data.name,
                    email: data.email,
                    phone: data.phone || '',
                    address: data.address || '',
                    image: data.image,
                    ktp: data.ktp || ''
                })
                this.handleDeleteImage()
                toast.fire({ icon: 'success', title: 'Berhasil Mengubah Foto Profil' })
                helperModalHide()
            })
            .catch(error => {
                toast.fire({ icon: 'warning', title: error.response.message })
                btnImg.stop()
            });
    }

    _sendUserImage = async (blob, btnImg) => {
        const response = await update('/user/update', this.props.uuid, {
            phone: this.props.user.phone,
            address: this.props.user.address,
            ktp: this.props.user.ktp,
            image: blob,
        })
        if (response.success) {
            const user = response.res.data
            this.props.setUser({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                image: user.image,
                ktp: user.ktp
            })

            this.handleDeleteImage()
            toast.fire({ icon: 'success', title: 'Berhasil Mengubah Foto Profil' })
            helperModalHide()
        } else {
            btnImg.stop()
        }
    }

    handleScale = e => {
        const scale = parseFloat(e.target.value)
        this.setState({ scale })
    }

    logCallback(e) {
        // eslint-disable-next-line
        console.log('callback', e)
    }

    setEditorRef = editor => {
        if (editor) this.editor = editor
    }

    handlePositionChange = position => {
        this.setState({ position })
    }

    handleDeleteImage = () => {
        this.setState({ image: '' })
        this.fileInput.value = "";
        document.querySelector(".filename").innerHTML = "No file selected";
    }

    render() {
        return (
            <div>
                <center>
                    {(this.state.image == '') ? null : (
                        <div>
                            <ReactAvatarEditor
                                ref={this.setEditorRef}
                                scale={parseFloat(this.state.scale)}
                                width={this.state.width}
                                height={this.state.height}
                                position={this.state.position}
                                onPositionChange={this.handlePositionChange}
                                onLoadFailure={this.logCallback.bind(this, 'onLoadFailed')}
                                onLoadSuccess={this.logCallback.bind(this, 'onLoadSuccess')}
                                onImageReady={this.logCallback.bind(this, 'onImageReady')}
                                image={this.state.image}
                                className="editor-canvas"
                            />
                            <br />

                            <div className="form-group">
                                <label>Zoom:</label>
                                <input
                                    name="scale"
                                    type="range"
                                    onChange={this.handleScale}
                                    min="1"
                                    max="5"
                                    step="0.01"
                                    defaultValue="1"
                                />
                            </div>

                            <div className="text-center">
                                <button type="submit" className="btn btn-primary btn-ladda btn-ladda-spinner ladda-button btn-image-spinner" data-spinner-color="#333" data-style="slide-down" onClick={this.handleSave}>
                                    <span className="ladda-label"><i className="icon-checkmark position-left"></i> Ganti</span>
                                    <span className="ladda-spinner"></span>
                                </button>
                                <button type="button" className="btn btn-danger" style={{ marginLeft: '12px' }} onClick={this.handleDeleteImage}><i className="icon-bin2 position-left"></i> Batal</button>
                            </div>
                        </div>
                    )}
                </center>

                <div className="form-group">
                    <label>Unggah Foto Baru:</label>
                    <input type="file" className="file-styled" onChange={this.handleNewImage} accept="image/png, image/jpeg" ref={ref => this.fileInput = ref} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    profile: state.profile,
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    setProfile: (value) => dispatch(setProfile(value)),
    setUser: (value) => dispatch(setUser(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangeUserImage);