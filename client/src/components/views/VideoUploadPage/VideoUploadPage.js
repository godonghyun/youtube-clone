// eslint-disable-next-line
import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import axios from "axios";
import { useSelector } from "react-redux";


const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' }
]

const CategoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 0, label: "Autos & Vehicles" },
    { value: 0, label: "Music" },
    { value: 0, label: "Pets & Animals" }
]

function VideoUploadPage(props) {
    const user = useSelector(state => state.user)
    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [ThumbnailPath, setThumbnailPath] = useState("");


    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value);
    };

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value);
    };

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value);
    };

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value);
    };

    const onDrop = (files) => {
        // 서버로 파일을 보내기 위해 파일 관련 config 작성
        let formData = new FormData();
        const config = {
            header: { "content-type": "multipart/form-data" },
        };
        formData.append("file", files[0]);

        axios.post("/api/video/uploadfiles", formData, config)
            .then((response) => {
                if (response.data.success) {
                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName,
                    };

                    setFilePath(response.data.url);

                    axios.post("/api/video/thumbnail", variable)
                        .then((response) => {
                            if (response.data.success) {
                                setDuration(response.data.fileDuration);
                                setThumbnailPath(response.data.url);
                            } else {
                                alert("썸내일 생성 실패");
                            }
                        });
                } else {
                    alert("업로드 실패");
                }
            }
            );
    };
    
    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath,
        };

        axios.post("/api/video/uploadVideo", variables)
            .then((response) => {
                if (response.data.success) {
                    message.success("비디오 업로드 성공");

                    setTimeout(() => {
                        props.history.push("/");
                    }, 3000);
                } else {
                    alert("비디오 업로드 실패");
                }
            });
    };

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* drop item */}
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={10000000000}
                    >
                        {
                            ({ getRootProps, getInputProps }) => (
                                <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }} {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <Icon type='plus' style={{ fontSize: '3rem' }}></Icon>
                                </div>
                            )
                        }

                    </Dropzone>

                    {/* thumbnail */}
                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }
                </div>
                <br />
                <br />

                <label htmlFor="">Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                ></Input>
                <br />
                <br />

                <label htmlFor="">Description</label>
                <Input
                    onChange={onDescriptionChange}
                    value={Description}
                ></Input>
                <br />
                <br />
                
                <select name="" id="" onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <br />
                <br />

                <select name="" id="" onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <br />
                <br />
                
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage
