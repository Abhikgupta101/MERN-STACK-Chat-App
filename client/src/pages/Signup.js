import React, { useState } from 'react';
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
import { storage } from '../Firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loader.js'

const theme = createTheme();

export default function SignUp() {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const userId = localStorage.getItem('userId')
    const [file, setFile] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let name = data.get('name')
        let email = data.get('email')
        let password = data.get('password')

        if (!email || !password || !name) {
            toast.error('All fields must be filled');
            return
        }
        setLoading(true)
        const storageRef = ref(storage, `/data/${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', fn1, fn2, fn3)

        function fn1(snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        }

        function fn2(error) {
        }

        function fn3(error) {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                const newAccount = async () => {
                    const response = await fetch(`${baseUrl}/api/user/signup`,
                        {
                            method: 'POST',
                            body: JSON.stringify({ email, password, name, image: url }),
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
                        toast.success(`Thanks! your account has been successfully created.`);
                        navigate(`/`, { replace: true });
                    }
                }

                newAccount()
            })
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
                            Sign up
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="name"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Name"
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ mb: 2 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                    />
                                </Grid>
                            </Grid>
                            <input style={{ display: 'none' }} type="file" id="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])}>
                            </input>
                            <label htmlFor="file" className='signup_file_lable'>
                                Upload Profile Pic
                            </label>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link to='/signin' style={{ color: 'blue', textDecoration: 'none' }}>
                                        Already have an account? Sign in
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