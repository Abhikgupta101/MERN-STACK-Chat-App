import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loader.js'

const theme = createTheme();

export default function SignIn() {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId')
    const [loading, setLoading] = React.useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let email = data.get('email')
        let password = data.get('password')

        if (!email || !password) {
            toast.error('All fields must be filled');
            return
        }
        setLoading(true)
        const response = await fetch(`${baseUrl}/api/user/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        })
        const json = await response.json()

        if (!response.ok) {
            toast.error(json.error);
            setLoading(false)
        }
        if (response.ok) {
            setLoading(false)
            localStorage.setItem('userId', json.user._id)
            toast.success(`Your are logged in successfully`)
            navigate(`/`, { replace: true });
        }
    };

    const randomSignin = async () => {
        const response = await fetch(`${baseUrl}/api/user/login`, {
            method: 'POST',
            body: JSON.stringify({ email: "a@a.com", password: "Abc_123$" }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        })
        const json = await response.json()

        if (!response.ok) {
            toast.error(json.error);

        }
        if (response.ok) {

            localStorage.setItem('userId', json.user._id)
            toast.success(`Your are logged in successfully`)
            navigate(`/`, { replace: true });
        }
    }


    return (
        !userId ? <>{loading ? <Loader /> : null}
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link to='/password/reset' style={{ color: 'blue', textDecoration: 'none' }}>
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link to='/signup' style={{ color: 'blue', textDecoration: 'none' }}>
                                        Don't have an account? Sign Up
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '50%', justifyContent: 'space-evenly', marginTop: '20px' }}>
                        <div>
                            OR
                        </div>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}

                            onClick={randomSignin}
                        >
                            Sign In As Random User
                        </Button>
                    </div>
                </Container>
            </ThemeProvider>
        </> : <Navigate to="/" />
    );
}