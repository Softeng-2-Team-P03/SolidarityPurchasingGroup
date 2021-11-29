import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';
import API from "../../API";

const FileUpload = (props) => {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);


    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };



    const onSubmit = async e => {
        let numImg = props.numProd+1
        let nameImg = 'p'+numImg.toString()+'-1.jpg'

        API.addImage(numImg,nameImg);

        e.preventDefault();
        const formData = new FormData();
        console.log(filename);
        if(filename!='Choose File')
            formData.append('file', file ,nameImg);
        else 
            formData.append('file', file);

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    setUploadPercentage(
                        parseInt(
                            Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        )
                    );
                }
            });

            // Clear percentage
            setTimeout(() => setUploadPercentage(0), 10000);

            const { fileName, filePath } = res.data;

            setUploadedFile({ fileName, filePath });

            setMessage('File Uploaded');
        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
            setUploadPercentage(0)
        }
    };

    return (
        <Fragment>
            {message ? <Message msg={message} /> : null}

            {uploadedFile ? (
                <div className='row mt-5'>
                    <div className='col-md-6 m-auto'>
                        <img style={{ width: '100%' }} src={uploadedFile.filePath}  />
                    </div>
                </div>
            ) : null}


            <form onSubmit={onSubmit}>
                <div className='custom-file mb-4'>
                    <input

                        type='file'
                        className='custom-file-input'
                        id='customFile'
                        onChange={onChange}
                    />
                    <label className='custom-file-label' htmlFor='customFile'>
                        {filename}
                    </label>
                </div>

                <Progress percentage={uploadPercentage} />

                <input
                    type='submit'
                    value='Upload image'
                    className='btn btn-secondary btn-block mt-4'
                />
            </form>

        </Fragment>
    );
};

export default FileUpload;
