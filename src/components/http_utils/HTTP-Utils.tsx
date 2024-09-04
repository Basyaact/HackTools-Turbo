import React, { useState } from 'react';
import {
    Button,
    Typography,
    Row,
    Col,
    Input,
    Select,
    Divider,
    Tag,
    message,
    Descriptions,
    Modal,
    Tabs,
    Alert
} from 'antd';
import { SendOutlined, FullscreenOutlined, ArrowsAltOutlined, DeleteOutlined } from '@ant-design/icons';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import axios, { Method } from 'axios';
import createPersistedState from 'use-persisted-state';
import SyntaxHighlighter from 'react-syntax-highlighter';
import pretty from 'pretty';
import { ContentProps } from 'components/types/ContentProps';
import { HttpUrlState } from 'components/types/HttpUrlState';
import { MSFBuilder } from 'components/types/MSFBuilder';
import { Payloads } from 'components/types/Payloads';
import { Encoder } from 'components/types/Encoder';
import { Platform } from 'components/types/Platform';
import { MsfVenomBuilder } from 'components/types/MsfVenomBuilder';

const useHttpUrlState = createPersistedState('http_url_repeater'); // 修改为钩子调用
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

export default function LinuxCommands() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const windowMode = () => {
        const width = 1100;
        const height = 800;

        chrome.windows.create({
            url: chrome.runtime.getURL('index.html'),
            width: width,
            height: height,
            type: 'popup',
        });
    };

    const target = window.location.href;
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleClose = () => {
        setIsModalVisible(false);
    };

    const [values, setValues] = useHttpUrlState({
        url: '',
        protocol: 'http://',
        type: 'GET',
    });

    const handleChange = (name: string) => (event: { target: { value: string } }) => {
        setValues({ ...values, [name]: event.target.value });
    };

    const handleChangeSelect = (name: string) => (event: string) => {
        setValues({ ...values, [name]: event });
    };

    const key = 'updatable';
    const [content, setContent] = useState<ContentProps | undefined>(undefined);
    const [headerContent, setHeaderContent] = useState('');
    const [commentResponse, setCommentResponse] = useState<string[]>([]);
    const [inputResponse, setInputResponse] = useState<string[]>([]);
    const [_, setLoading] = useState<Boolean>(false);

    const handleDelete = () => {
        setContent(undefined);
        setHeaderContent('');
        setCommentResponse([]);
        setInputResponse([]);
        setValues({ ...values, url: '' });
    };

    const fetchData = async () => {
        message.loading({ content: 'Loading...', key });
        setLoading(true);

        try {
            const res = await axios({
                method: values.type as Method,
                url: values.protocol + values.url.replace(/https?:\/\//, ''),
                headers: {},
            });

            setLoading(false);
            setContent(res.data);
            message.success({ content: 'Loaded!', key });
            setHeaderContent(res.headers['content-type']);
            const commentOnlyRegex = res.data.match(/(\/\*[\w\'\s\r\n\*]*\*\/)|(\/\/[\w\s\']*)|(\<![\-\-\s\w\>\/]*\>)/g);
            if (commentOnlyRegex) setCommentResponse(commentOnlyRegex);
            const inputOnlyRegex = res.data.match(/<form(.*?)<\/form>/g);
            if (inputOnlyRegex) setInputResponse(inputOnlyRegex);
        } catch (err: any) {
            console.error(err);
            message.error({ content: err.message, key });
            setLoading(false);
        }
    };

    return (
        <div>
            <Title level={2} style={{ fontWeight: 'bold', margin: 15 }}>
                HTTP Repeater
            </Title>
            <Paragraph style={{ marginLeft: 15 }}>
                HTTP Repeater is a simple tool for manually manipulating and reissuing individual HTTP and WebSocket
                messages, and analyzing the application's responses.
            </Paragraph>
            <Divider dashed />
            <Row gutter={[16, 16]} style={{ padding: 15 }}>
                <Col>
                    <Select
                        defaultValue="GET"
                        style={{ width: '100%' }}
                        value={values.type}
                        placeholder="GET"
                        onChange={handleChangeSelect('type')}
                    >
                        <Option value="GET">GET</Option>
                        <Option value="POST">POST</Option>
                        <Option value="HEAD">HEAD</Option>
                        <Option value="PUT">PUT</Option>
                        <Option value="DELETE">DELETE</Option>
                        <Option value="OPTIONS">OPTIONS</Option>
                        <Option value="PATCH">PATCH</Option>
                    </Select>
                </Col>
                <Col>
                    <Select
                        defaultValue="http://"
                        style={{ width: '100%' }}
                        value={values.protocol}
                        placeholder="http://"
                        onChange={handleChangeSelect('protocol')}
                    >
                        <Option value="http://">HTTP</Option>
                        <Option value="https://">HTTPS</Option>
                    </Select>
                </Col>
                <Col span={9}>
                    <Input
                        style={{ borderColor: '#434343' }}
                        onChange={handleChange('url')}
                        onSubmit={() => fetchData()}
                        allowClear
                        value={values.url.replace(/https?:\/\//, '')}
                        placeholder="http://example.com"
                    />
                </Col>
                <Col>
                    <Button type="primary" onClick={fetchData} icon={<SendOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
                        Send
                    </Button>
                </Col>
                <Col>
                    <Button type="link" danger icon={<DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} onClick={handleDelete} />
                </Col>
            </Row>

            {content ? (
                <div style={{ padding: 15 }}>
                    <Descriptions title="Request info" style={{ marginBottom: 15 }}>
                        <Descriptions.Item label="Status code">
                            <Tag color="success">
                                {content.status} {content.statusText}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Content-Type">
                            <Tag color="geekblue">{headerContent}</Tag>
                        </Descriptions.Item>
                    </Descriptions>

                    <Tabs defaultActiveKey="1">
                        <TabPane tab="HTML Response" key="1">
                            <SyntaxHighlighter language="htmlbars" style={vs2015} showLineNumbers={true}>
                                {pretty(content.data) || <pre>No response</pre>}
                            </SyntaxHighlighter>
                        </TabPane>

                        {commentResponse.length > 0 && (
                            <TabPane tab="Comment Only" key="2">
                                {commentResponse.map((match, index) => (
                                    <SyntaxHighlighter key={index} language="htmlbars" style={vs2015}>
                                        {match}
                                    </SyntaxHighlighter>
                                ))}
                            </TabPane>
                        )}

                        {inputResponse.length > 0 && (
                            <TabPane tab="Form / Input Only" key="3">
                                {inputResponse.map((match, index) => (
                                    <SyntaxHighlighter key={index} language="htmlbars" style={vs2015} showLineNumbers={true}>
                                        {pretty(match)}
                                    </SyntaxHighlighter>
                                ))}
                            </TabPane>
                        )}
                    </Tabs>
                </div>
            ) : (
                <div style={{ padding: 15 }}>
                    <Alert
                        message="Informational Notes"
                        description="We recommend using this feature in Fullscreen or Pop-up mode."
                        type="info"
                        showIcon
                    />
                    <Button icon={<FullscreenOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} style={{ marginTop: 15 }} type="link" danger>
                        <a href={target} style={{ color: '#a61d24' }} rel="noreferrer noopener" target="_blank">
                            Fullscreen mode
                        </a>
                    </Button>
                    <Button icon={<ArrowsAltOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} onClick={windowMode} type="link">
                        Pop-up mode
                    </Button>
                </div>
            )}
        </div>
    );
}