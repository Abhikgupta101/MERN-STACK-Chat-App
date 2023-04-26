import React, { useEffect, useState } from 'react'
import { storage } from '../Firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { setGroup } from '../store/groupSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/usersSlice';
import Users from './Users';
import { setNotifications } from '../store/notificationsSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addChat, fetchUser } from '../store/userSlice';
import { setChatId, setcurrentChat } from '../store/currentChatSlice';
import { fetchSingleChat } from '../store/messagesSlice';
import Loader from './Loader';

const Other = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const userID = localStorage.getItem('userId')
    const chatId = useSelector(state => state.currentChat.chatId)
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState('')
    const [groupName, setGroupName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])

    const dispatch = useDispatch();
    const value = useSelector(state => state.group)
    const currentChat = useSelector(state => state.currentChat.currentChat)
    const usersData = useSelector(state => state.users)
    const notifications = useSelector(state => state.notifications)

    const createGroup = () => {
        // if (selectedUsers.length == 0) {
        //     toast.error('Atleast 2 members are required to create a group')
        //     return
        // }
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
                const newGroup = async () => {
                    const response = await fetch(`${baseUrl}/api/chats/chatRoom`, {
                        method: 'POST',
                        body: JSON.stringify({ name: groupName, userIds: [...selectedUsers, userID], image: url }),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        mode: 'cors'
                    })
                    const json = await response.json()

                    if (!response.ok) {
                        setLoading(false)
                        toast.error(json.error)
                    }
                    if (response.ok) {
                        setLoading(false)
                        toast.success('A new group is created')
                        dispatch(addChat({ ...json }))
                    }
                }

                newGroup()
            })
            dispatch(setGroup(null))
            setSelectedUsers([])

        }

    }

    const startChat = async (e) => {
        e.preventDefault();
        if (selectedUsers.length == 0) {
            toast.error('Please select a member')
            return
        }
        setLoading(true)
        const response = await fetch(`${baseUrl}/api/chats/privateChat`, {
            method: 'POST',
            body: JSON.stringify({ userId: selectedUsers[0].id }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        })
        const json = await response.json()

        if (!response.ok) {
            toast.error(json.error)
            setLoading(false)
        }
        if (response.ok) {
            setLoading(false)
            if (json.message == "found") {
                dispatch(setChatId(json.privateChat._id))
                dispatch(fetchSingleChat(json.privateChat._id, baseUrl))
                dispatch(setcurrentChat(json.privateChat))
            }
            else {
                dispatch(fetchUser(userID, baseUrl))
                dispatch(addChat({ ...json.privateChat }))
                dispatch(setChatId(json.privateChat._id))
                dispatch(fetchSingleChat(json.privateChat._id, baseUrl))
                dispatch(setcurrentChat(json.privateChat))
                toast.success('A new chat is created')
            }
        }
        dispatch(setGroup(null))
        setSelectedUsers([])
    }

    const selectUsers = (e) => {
        if (!groupName) {
            toast.error('Name of group is required')
            return
        }
        dispatch(setGroup('select_users'))
        dispatch(fetchUsers(baseUrl))
    }
    const removeValue = () => {
        dispatch(setGroup(null))
        setSelectedUsers([])
    }

    const addNewMembers = async () => {
        setLoading(true)
        const response = await fetch(`${baseUrl}/api/chats/addNewMember/${chatId}`, {
            method: 'POST',
            body: JSON.stringify({ userIds: selectedUsers }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        })
        const json = await response.json()

        if (!response.ok) {
            toast.error(json.error)
            setLoading(false)
        }
        if (response.ok) {
            toast.success('New members are added to group')
            setLoading(false)
            dispatch(setGroup(null))
            setSelectedUsers([])
        }
    }

    const addMember = (user) => {
        if (value == 'new_chat') {
            setSelectedUsers([{ id: user._id, name: user.name }])
            return
        }
        else {
            if (selectedUsers.includes(user._id)) {
                let updated_users = selectedUsers.filter((item) => item !== user._id)
                setSelectedUsers([...updated_users])
            }
            else {
                setSelectedUsers([...selectedUsers, user._id])
            }
        }

    }
    const clearNotification = () => {
        dispatch(setNotifications([]))
        dispatch(setGroup(null))
    }
    return (
        value ?
            <div className='createGroup'>
                {loading ? <Loader /> : null}
                {value == 'create_group' ?
                    <div className='createGroup_cont'>
                        <div className='createGroup_img'>
                            <input style={{ display: 'none', outline: 'none' }} type="file" id="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])}>
                            </input>
                            <label for="file" className='group_file_lable'>
                            </label>
                        </div>
                        <div className='createGroup_actions'>
                            <div className='createGroup_input'>
                                <input className='search_input' type="text" placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} ></input>
                            </div>
                            <div className='createGroup_btn'>
                                <button className='grbtn' onClick={removeValue}>Cancel</button>
                                <button className='grbtn' onClick={selectUsers}>Next</button>
                            </div>
                        </div>
                    </div> :
                    null}
                {(value == 'select_users' || value == 'new_chat' || value == 'add_new_members') && usersData ?
                    <div className='members_cont'>
                        <div className="add_members">
                            {value == 'select_users' ? <>Add Members {selectedUsers.length} / {usersData.length - 1}</> :
                                <>
                                    Select Member - {selectedUsers.length > 0 ? selectedUsers[0].name : null}
                                </>}
                        </div>
                        <div>
                            {
                                usersData.length > 0 && usersData.map((user) => (
                                    <div key={user._id} >
                                        {
                                            user._id !== userID && value != 'new_chat' && (Object.keys(currentChat).length === 0 ? true : !currentChat.userIds.includes(user._id)) ?
                                                < div className="select_user" onClick={() => addMember(user)}
                                                >
                                                    <div style={{ display: 'flex', flex: '0.4', justifyContent: 'center', alignItems: 'center' }}>
                                                        <img style={{ width: '35px', height: '35px', borderRadius: '100px', marginLeft: '5%' }}
                                                            src={user.avatar}
                                                        />
                                                    </div>
                                                    <div style={{ display: 'flex', flex: '0.6', justifyContent: 'center', alignItems: 'center' }}>
                                                        {user.name}
                                                    </div>
                                                </div> :
                                                <>{user._id !== userID && value == 'new_chat' ? < div className="select_user" onClick={() => addMember(user)}
                                                >
                                                    <div style={{ display: 'flex', flex: '0.4', justifyContent: 'center', alignItems: 'center' }}>
                                                        <img style={{ width: '35px', height: '35px', borderRadius: '100px', marginLeft: '5%' }}
                                                            src={user.avatar}
                                                        />
                                                    </div>
                                                    <div style={{ display: 'flex', flex: '0.6', justifyContent: 'center', alignItems: 'center' }}>
                                                        {user.name}
                                                    </div>
                                                </div> : null}
                                                </>
                                        }
                                    </div>
                                ))
                            }
                        </div>
                        <div className='chatting_btn'>
                            <button className='grbtn' onClick={removeValue}>Cancel</button>
                            {value == 'select_users' ?
                                <button className='grbtn' onClick={createGroup}>Create</button> : null
                            }
                            {
                                value == 'new_chat' ? <button className='grbtn' onClick={startChat}>Start Chatting</button> : null
                            }
                            {
                                value == 'add_new_members' ? <button className='grbtn' onClick={addNewMembers}>Add</button> : null
                            }
                        </div>
                    </div>
                    : null}
                {
                    value == 'notification' ?
                        <div className='members_cont'>
                            <div className="add_members">
                                <>Notification</>
                            </div>
                            <div className='users_cont'>
                                <>
                                    {
                                        notifications.length === 0 ?
                                            <div style={{ marginTop: '50%' }}>
                                                No Notifications
                                            </div> :
                                            <>
                                                {
                                                    notifications.map((item) => (
                                                        <Users key={item.room} chat={item} user={item} type='notification' />
                                                    ))
                                                }
                                            </>
                                    }

                                </>
                            </div>
                            <div className='chatting_btn'>
                                <button className='grbtn' onClick={removeValue}>Cancel</button>
                                {value == 'select_users' ? <button className='grbtn' onClick={createGroup}>Create</button> :
                                    <button className='grbtn' onClick={clearNotification}>Clear</button>
                                }
                            </div>
                        </div> : null
                }
            </div > : null
    )
}

export default Other