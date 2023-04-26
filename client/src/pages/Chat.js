import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import MessagesForm from '../components/MessagesForm'
import Users from '../components/Users'
import { useDispatch, useSelector } from "react-redux";
import Other from '../components/Other';
import { fetchUser } from '../store/userSlice';
import Loader from '../components/Loader.js'
import { Navigate } from 'react-router-dom';

const Chat = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const userId = localStorage.getItem('userId')
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const usersData = useSelector(state => state.users)

    const userData = useSelector(state => state.user.user)
    const chatData = useSelector(state => state.user.chat)
    const [search, setSearch] = useState('')
    const notifications = useSelector(state => state.notifications)

    const dispatch = useDispatch();
    const userMenu = useSelector(state => state.responsive)
    const windowValue = useSelector(state => state.window)

    useEffect(() => {
        dispatch(fetchUser(userId, baseUrl))
    }, [])

    useEffect(() => {
        const filterChats = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/chats/search?search=${search}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    mode: 'cors'
                })
                const json = await response.json()
                if (response.ok) {
                    setData([...json.chats, ...json.users])
                }
            } catch (err) {
                setLoading(false)
            }
        }
        filterChats();
    }, [search]);

    return (
        userId ? <>{loading || !chatData ? <Loader /> : null}
            <div>
                <Navbar />
                <div className='home'>
                    <Other />
                    <div className='users'
                        style={{ display: windowValue > 600 ? 'flex' : `${userMenu}` }}
                    >
                        <div className='container'>
                            <div className='search_bar'>
                                <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className='search_input'></input>
                            </div>
                            {/* need to update the admin */}
                            {
                                search !== '' && data && data.map((chat) => (
                                    <div key={chat._id}>
                                        {
                                            chat.admin == null ?
                                                <>
                                                    {
                                                        chat._id === userId ? null : <Users chat={chat} user={chat} type="user" />
                                                    }
                                                </> : <Users chat={chat} user={chat} type="group" />
                                        }
                                    </div>
                                ))
                            }

                            {
                                search == '' && chatData && chatData.map((chat) => (
                                    <div key={chat._id}>
                                        <>
                                            {
                                                chat.admin == null ?
                                                    <>
                                                        {
                                                            chat.users[0].id === userId ? <Users chat={chat} user={chat.users[1]} type="private" /> : <Users chat={chat} user={chat.users[0]} type="private" />
                                                        }
                                                    </> : <Users chat={chat} user={chat} type="group" />
                                            }
                                        </>
                                    </div>
                                ))
                            }
                        </div>

                    </div>

                    <MessagesForm
                    />
                </div >
            </div >
        </> : <Navigate to="/signin" />
    )
}

export default Chat