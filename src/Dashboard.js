import { Page, Table, Button, PreviewWidget, Text, Box, TextButton } from '@wix/design-system'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            const response = await fetch('/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            });

            if (response.ok) {
                console.log('Logout successful!');
                localStorage.setItem('token', null);
                navigate('/login');
            } else {
                console.error('Failed to logout!');
            }
        } catch (error) {
            console.log('Error occured during logout: ', error);
        }
    }
    return (
        <div>
            <Button skin="destructive" onClick={handleLogout}>Logout</Button>
        </div>
    );
}

const Dashboard = () => {

    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [token, setToken] = useState(null);
    const [currentUser, setCurrentUser] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);
        if (token == 'null') {
            console.log('token not present');
            setToken(null);
            return;
        }
        fetch('/dashboard', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch data');
            }
        })
        .then(responseData => {
            const usersData = responseData['users'].map((user, index) => {
                // console.log('Current user - ', responseData['currentUser']['username'] == user.username);
                let logoutButton = null;
                if (user.username === responseData['currentUser']['username']) {
                    logoutButton = <LogoutButton />
                    setCurrentUser(user.username);
                }
                return {
                    ...user,
                    username: user.username,
                    logout: logoutButton,
                    index: index+1
                }
            });
            setUsers(usersData);
            // console.log('Current user ', currentUser);
            // console.log('Response from server - ', responseData['currentUser']);
        })
        .catch(error => {
            console.error('Error occured: ', error);
        })
    }, []);


    const columns = [
        {
            title: 'Sr.No.',
            render: (row) => row.index,
        },
        {
            title: 'Username',
            render: (row) => row.username,
        },
        {
        title: 'Device',
        render: (row) => row.device,
        },
        {
        title: 'Ip Address',
        render: (row) => row.ipAddress,
        },
        {
        title: 'Login Time',
        render: (row) => row.loginTime.slice(0,19),
        },
        {
        title: 'Logout',
        render: (row) => row.logout,
        },
    ];
    return (
        <div>
            <Page>
                <Page.Header title="Dashboard"/>
                <Page.Content>
                    <Box padding="SP2">
                        {
                            !token ? (
                                <Text size="medium">
                                    You are logged out, <TextButton onClick={() => {navigate('/login')}}>login</TextButton> to continue.
                                </Text>
                            ) : (
                                <Text size="medium">
                                    Currently logged in as {currentUser}
                                </Text>
                            )
                        }
                    </Box>
                    <Box paddilng="SP4">
                        <Table skin="standard" data={users} columns={columns}>
                            <Table.Content />
                        </Table>
                    </Box>
                </Page.Content>
            </Page>
        </div>
    );
}

export default Dashboard;