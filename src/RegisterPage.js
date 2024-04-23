import { Page, Box, Input, Button, Text, Heading, TextButton } from '@wix/design-system';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from './config';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const formData = {
            username: username,
            email: email,
            password: password
        };

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log('User registered successfully');
                setUsername('');
                setEmail('');
                setPassword('');
                navigate('/login');
            } else {
                const errorData = await response.json();
                setError(errorData.message);
                console.error('Failed to register user');
            }
        } catch (error) {
            setError('Internal Server Error!');
            console.error('Error occured:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Page>
                <Page.Content>
                    <Box padding="SP4" align='center'>
                        <Heading size="large">Register</Heading>
                    </Box>
                    <Box padding="SP2" direction='vertical' align='center'>
                        <Box padding="SP2" direction='horizontle' align='center'>
                            <Box padding="SP2">
                                <Text>Username : </Text>
                            </Box>
                            <Box padding="SP2" >
                                <Input 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    size='medium'
                                    placeholder='username'
                                    status={error ? "error" : loading ? "loading" : undefined}
                                    statusMessage={error ? error : undefined}
                                />
                            </Box>
                        </Box>
                        <Box padding="SP2" direction='horizontle'>
                            <Box padding="SP2">
                                <Text>Email  :</Text>
                            </Box>
                            <Box padding="SP2" >
                                <Input 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    size='medium'
                                    placeholder='email'
                                    status={error ? "error" : loading ? "loading" : undefined}
                                    statusMessage={error ? error : undefined}
                                />
                            </Box>
                        </Box>
                        <Box padding="SP2" direction='horizontle'>
                            <Box padding="SP2">
                                <Text>Password :</Text>
                            </Box>
                            <Box padding="SP2" >
                                <Input 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type='password'
                                    size='medium'
                                    placeholder='password'
                                    status={error ? "error" : loading ? "loading" : undefined}
                                    statusMessage={error ? error : undefined}
                                />
                            </Box>
                        </Box>
                        <Box padding="SP2" >
                            <Button onClick={(e) => handleSubmit(e)}>Register</Button>
                        </Box>
                        <Box padding="SP4">
                            <Text size="medium">
                                Already registered? <TextButton onClick={() => {navigate('/login')}}>login</TextButton> to continue.
                            </Text>
                        </Box>
                    </Box>
                </Page.Content>
            </Page>
        </div>
    );
}

export default RegisterPage;