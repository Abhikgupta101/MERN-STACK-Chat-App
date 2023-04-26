import { useDispatch, useSelector } from "react-redux";
import { setGroup } from "../store/groupSlice";
import { fetchSingleChat } from "../store/messagesSlice";
import { removeNotification } from "../store/notificationsSlice";
import { setChatId, setcurrentChat } from "../store/currentChatSlice";
import { showUsers } from "../store/responsiveSlce";
import { addChat, fetchUser } from "../store/userSlice";

const Users = ({ chat, user, type }) => {
    const dispatch = useDispatch();
    const userMenu = useSelector(state => state.responsive)
    const userID = localStorage.getItem('userId')
    const currentChat = useSelector(state => state.currentChat.currentChat)
    const chatId = useSelector(state => state.currentChat.chatId)

    const selectChat = async (e) => {
        const baseUrl = process.env.REACT_APP_BASE_URL
        e.preventDefault()
        dispatch(showUsers(userMenu))
        if (type == 'notification') {
            dispatch(setChatId(chat.room))
            dispatch(fetchSingleChat(chat.room, baseUrl))
            dispatch(removeNotification(user.room))
            dispatch(setGroup(null))
            dispatch(setcurrentChat({ ...chat.currentChat, chatName: user.message.user_name }))
        }
        else if (type == 'user') {
            const response = await fetch(`${baseUrl}/api/chats/privateChat`, {
                method: 'POST',
                body: JSON.stringify({ userId: user._id }),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors'
            })
            const json = await response.json()

            if (json.message == "found") {

                dispatch(setChatId(json.privateChat._id))
                dispatch(fetchSingleChat(json.privateChat._id, baseUrl))
                dispatch(setcurrentChat({ ...json.privateChat, chatName: user.name }))
            }
            else {

                dispatch(fetchUser(userID, baseUrl))
                dispatch(addChat({ ...json.privateChat }))
                dispatch(setChatId(json.privateChat._id))
                dispatch(fetchSingleChat(json.privateChat._id, baseUrl))
                dispatch(setcurrentChat({ ...json.privateChat, chatName: user.name }))
            }
        }
        else {
            dispatch(setChatId(chat._id))
            dispatch(fetchSingleChat(chat._id, baseUrl))
            dispatch(removeNotification(chat._id))
            dispatch(setcurrentChat({
                ...chat, chatName: user.name
            }))
        }


    }

    return (

        <div className="single_user" onClick={selectChat} style={chatId == chat._id ? { backgroundColor: 'rgb(146, 146, 246)' } : null} >
            <div style={{ display: 'flex', flex: '0.2', justifyContent: 'center', alignItems: 'center' }}>
                {
                    type !== 'notification' ?
                        <img style={{ width: '40px', height: '40px', borderRadius: '100px', marginLeft: '5%' }}
                            src={user.avatar} />
                        :
                        <img style={{ width: '40px', height: '40px', borderRadius: '100px', marginLeft: '5%' }}
                            src={user.message.avatar} />
                }
            </div>
            <div style={{
                display: 'flex', flexDirection: 'column', flex: '1', justifyContent: 'flex-start',
                height: '7vh',
                alignItems: 'center',
                fontSize: 'small'
            }}>
                <div style={{
                    flex: '0.5', width: '100%',
                    fontWeight: '650',
                    overflowY: 'hidden'
                }}>
                    {type == 'notification' ? <>{user.message.user_name}</> : <>{user.name}</>}
                </div>
                {type !== 'user' ? <div style={{
                    flex: '0.5', width: '100%',
                    fontSize: 'small',
                    overflow: 'hidden'
                }}>
                    {type == 'notification' ?
                        <>{user.message.text}</> :
                        <>
                            {
                                chat.lastMessage.user_id !== userID ?
                                    <>{chat.lastMessage.user_name == null ? null : <>{chat.lastMessage.user_name} :</>}</> : <>You :</>
                            } <>{chat.lastMessage.text}</>
                        </>
                    }
                </div> : null}
            </div>

        </div >
    )
}

export default Users