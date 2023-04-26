import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { showUsers } from '../store/responsiveSlce';
import MenuIcon from '@mui/icons-material/Menu';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCommentIcon from '@mui/icons-material/AddComment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { setGroup } from '../store/groupSlice';
import { fetchUsers } from '../store/usersSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setChatId, setcurrentChat } from '../store/currentChatSlice';
import Loader from './Loader';


const Navbar = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notifications)
    const userMenu = useSelector(state => state.responsive)
    const userData = useSelector(state => state.user.user)
    const usersMenu = () => {
        dispatch(showUsers(userMenu))
    }

    const logout = async () => {
        setLoading(true)
        const response = await fetch(`${baseUrl}/api/user/logout`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        })
        const json = await response.json()

        if (!response.ok) {
            setLoading(false)
            toast.error(json.message)
        }
        if (response.ok) {
            setLoading(false)
            toast.success(json.message)
            localStorage.removeItem("userId");
            navigate(`/signin`, { replace: true });
        }
    }

    const newGroup = () => {
        dispatch(setGroup('create_group'))
        dispatch(setcurrentChat({}))
        dispatch(setChatId(null))
    }
    const newChat = () => {
        dispatch(setGroup('new_chat'))
        dispatch(fetchUsers(baseUrl))
    }
    const newNotifications = () => {
        dispatch(setGroup('notification'))
    }

    return (
        <>{loading ? <Loader /> : null}
            <div className='nav_container'>
                <div className='nav_menu'>
                    <MenuIcon onClick={usersMenu} />
                </div>
                <div className='nav_logo'>
                    <img style={{ width: '50px', height: '50px', borderRadius: '100px' }} src={userData.avatar} />
                    <div>{userData.name}</div>
                </div>

                <div className='nav_links'>
                    <div onClick={newChat} className='links'>
                        <div className='links_icons'>
                            <AddCommentIcon />
                            <div>New Chat</div>
                        </div>
                    </div>
                    <div onClick={newGroup} className='links'>
                        <div className='links_icons'>
                            <GroupAddIcon />
                            <div>New Group</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex' }} onClick={newNotifications}>
                        <div className='links_icons'>
                            <NotificationsIcon />
                            <div>Notifications</div>
                        </div>
                        <div style={{ position: 'absolute', top: "5px", left: "73.5vw", color: "red", fontWeight: 'bolder' }}>{notifications.length == 0 ? null : notifications.length}</div>

                    </div>
                    <div onClick={logout} className='links_icons'>
                        <LogoutIcon />
                        <div>Logout</div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Navbar