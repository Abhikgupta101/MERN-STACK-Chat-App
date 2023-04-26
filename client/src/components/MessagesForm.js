import React, { useEffect, useState } from 'react'
import { Flex, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import ScrollableFeed from 'react-scrollable-feed'
import io from 'socket.io-client'
import { setMessages, updateMessages } from '../store/messagesSlice';
import { removeNotification, setNotifications } from '../store/notificationsSlice';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { setChatId, setcurrentChat } from '../store/currentChatSlice';
import { setGroup } from '../store/groupSlice';
import { fetchUsers } from '../store/usersSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { removeChats, updateChats } from '../store/userSlice';
import Loader from './Loader';

//connectioon established with socket.io
const socket = io(`${process.env.REACT_APP_BASE_URL}`, { transports: ['websocket'] });

var currentChatId

const MessagesForm = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const [options, setOptions] = useState(false)
    const [loading, setLoading] = useState(false)
    const [join, setJoin] = useState(false)
    const userID = localStorage.getItem('userId')
    const chatId = useSelector(state => state.currentChat.chatId)
    const messages = useSelector(state => state.messages)
    const currentChat = useSelector(state => state.currentChat.currentChat)
    const notifications = useSelector(state => state.notifications)
    const dispatch = useDispatch()

    const [curmsg, setCurmsg] = useState('')

    const showOptions = () => {
        setOptions(true)
    }

    const sendMsg = async (e) => {
        e.preventDefault();
        setLoading(true)
        const response = await fetch(`${baseUrl}/api/message/sendMessage/${chatId}`, {
            method: 'POST',
            body: JSON.stringify({
                text: curmsg
            }),
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
            toast.success('Message sent')
            setLoading(false)
            dispatch(setMessages({ ...json }))
            dispatch(updateChats(
                {
                    ...json, chatId
                }
            ))
            socket.emit("send_message", { message: { ...json }, room: chatId, currentChat })
            setCurmsg('')
        }

    }

    const deleteMsg = async (msg) => {
        setLoading(true)
        const response = await fetch(`${baseUrl}/api/message/deleteMessage/${chatId}`, {
            method: 'POST',
            body: JSON.stringify({
                msg
            }),
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
            toast.success('Message deleted')
            dispatch(updateMessages(msg))
            dispatch(updateChats(
                {
                    ...json, chatId
                }
            ))
            socket.emit("delete_message", { message: { ...json }, room: chatId })
            setCurmsg('')
        }
    }

    useEffect(() => {
        if (chatId !== null) {
            currentChatId = chatId
            if (currentChat.userIds.includes(userID)) {
                setJoin(false)
            }
            else {
                setJoin(true)
            }
            socket.emit("join_room", { room: chatId })
        }
    }, [userID, currentChat])

    useEffect(() => {
        socket.on("receive_message", (data) => {
            if (data.room === currentChatId) {
                dispatch(setMessages(data.message))
                dispatch(updateChats(
                    {
                        ...data.message, chatId: data.room
                    }
                ))
            }
            else {
                dispatch(setNotifications(data))
                dispatch(updateChats(
                    {
                        ...data.message, chatId: data.room
                    }
                ))
                toast.success("New notification received")
            }
        })
    }, [])

    useEffect(() => {
        socket.on("message_deleted", (data) => {
            if (data.room === currentChatId) {
                dispatch(updateMessages(data.message._id))
                dispatch(updateChats(
                    {
                        ...data.message, chatId: data.room
                    }
                ))
            }
            else {
                dispatch(removeNotification(data.message._id))
                dispatch(updateChats(
                    {
                        ...data.message, chatId: data.room
                    }
                ))
            }
        })
    }, [])

    const leaveGroup = async () => {
        setLoading(true)
        const response = await fetch(`${baseUrl}/api/chats/exitChat/${chatId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        })
        const json = await response.json()
        if (!response.ok) {
            toast.error(json.error)
        }
        if (response.ok) {
            setLoading(false)
            toast.success(json.message)
            dispatch(removeChats(chatId))
            dispatch(setChatId(null))
            dispatch(setcurrentChat({}))
            dispatch(setMessages([]))
            setOptions(false)
        }
    }

    const addMember = () => {
        setOptions(false)
        dispatch(setGroup('add_new_members'))
        dispatch(fetchUsers(baseUrl))
    }

    const joinGroup = async () => {
        const response = await fetch(`${baseUrl}/api/chats/addNewMember/${chatId}`, {
            method: 'POST',
            body: JSON.stringify({ userIds: [userID] }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        })
        const json = await response.json()

        if (!response.ok) {
            toast.error(json.error)
        }
        if (response.ok) {
            toast.success('You have joined the group')
            setJoin(false)
            dispatch(setGroup(null))
        }
    }

    useEffect(() => {
        window.scrollTo(100, 100);
    }, []);



    return (
        <>{loading ? <Loader /> : null}
            <div className='messageform'>
                <div className="chat_header">
                    <div style={{ display: 'flex', height: '100%', flex: '1', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: '1', textIndent: '15px' }}>
                            {currentChat.chatName}
                        </div>
                        {chatId ?
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", flexBasis: "20%" }}>
                                <MoreVertIcon onClick={showOptions} />
                            </div> : null
                        }
                    </div>
                </div>
                {options ? <div className='chat_options'>
                    <div className='chat_options_cont'>
                        <div className='options' onClick={leaveGroup}>
                            <LogoutIcon />
                            <>Leave Chat</>
                        </div>
                        {/* instead of current chat use private chat to see if empty or nor */}
                        {currentChat.admin !== null ? <div className='options' onClick={addMember} >
                            <PersonAddIcon />
                            <>Add Members</>
                        </div> : null}
                        <div className='options'>
                            <button className='grbtn' onClick={() => setOptions(false)}>Cancel</button>
                        </div>
                    </div>
                </div> : null}
                <ScrollableFeed className='messages_box' forceScroll='true'>
                    {messages.length !== 0 ? <>
                        {
                            messages.map((msg) => (
                                <div key={msg._id}>
                                    {
                                        msg.user_id == userID ?
                                            <Flex w="100%" h="80%" overflowY="hidden" flexDirection="column" p="3">
                                                <Flex w="100%" justify="flex-end">
                                                    <Flex
                                                        flexDirection="column"
                                                        borderRadius='5'
                                                        borderBottomLeftRadius='0'
                                                        bg="black"
                                                        color="white"
                                                        minW="100px"
                                                        maxW="350px"
                                                        mr="10"
                                                        my="0"
                                                        mt='0'
                                                        mb="10"
                                                        p="3"
                                                    >
                                                        <Text marginTop="0" fontSize={13}>
                                                            {msg.text}
                                                            {/* <Text fontSize={10} color="gray" style={{ display: 'flex', justifyContent: 'flex-end' }}>{msg.createdAt.split(" ")[4]}</Text> */}
                                                        </Text>
                                                    </Flex>
                                                    <div style={{ alignItems: 'center', marginRight: '10px' }} onClick={() => deleteMsg(msg._id)}>
                                                        {msg.text !== "message was deleted" ? < DeleteIcon style={{ color: 'white' }} /> : null}
                                                    </div>
                                                </Flex>
                                            </Flex>

                                            :
                                            <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3" >
                                                <Flex w="100%" justify="flex-start">
                                                    <Flex
                                                        flexDirection="column"
                                                        borderRadius='5'
                                                        borderBottomRightRadius='0'
                                                        bg="white"
                                                        color="black"
                                                        minW="100px"
                                                        maxW="350px"
                                                        ml="10"
                                                        mb="10"
                                                        my="0"
                                                        p="3"
                                                    >
                                                        <Text fontSize={10} color="black" fontWeight='bold'>
                                                            {msg.user_name}
                                                        </Text>
                                                        <Text marginTop="0" fontSize={13}>
                                                            {msg.text}
                                                            <Text fontSize={10} color="gray" style={{ display: 'flex', justifyContent: 'flex-end' }}>{msg.createdAt.split(" ")[4]}</Text>
                                                        </Text>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                    }
                                </div>
                            ))
                        }
                    </> :
                        <div style={{ marginTop: '40vh', marginLeft: '30vw', color: 'white', fontSize: '4vh' }}>
                            Start Chatting
                        </div>}
                </ScrollableFeed >
                {chatId ? <>
                    {!join ?
                        <div className='messageform_cont'>
                            <input style={{ height: "2vh", flex: "1", padding: "11px", border: "none", outline: "none" }} type="text" placeholder="Your Message" value={curmsg} onChange={(e) => setCurmsg(e.target.value)}></input>
                            <button style={{
                                height: "5vh", flex: "0.1"
                            }} onClick={sendMsg}><SendIcon />
                            </button>
                        </div> :
                        <div className='messageform_cont'>
                            <button style={{
                                height: "5vh", width: '100%',
                                color: 'rgba(0, 49, 60, 0.79)',
                                fontWeight: 'bold'
                            }} onClick={joinGroup}>
                                JOIN GROUP
                            </button>
                        </div>}
                </> : null}
            </div >
        </>
    )
}

export default MessagesForm