(function () {
    const config = window.CHAT_CONFIG || {};
    const token = config.token;
    const APP_URL = 'http://localhost:3000';

    if (!token) {
        console.error("Chat widget: token required");
        return;
    }

    const socketIOScript = document.createElement('script');
    socketIOScript.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
    socketIOScript.onload = initWidget;
    document.head.appendChild(socketIOScript);

    function initWidget() {
        let socket;
        let phone = sessionStorage.getItem('chat_phone_agent');

        const chatButton = document.createElement('div');
        chatButton.textContent = '💬';
        Object.assign(chatButton.style, {
            position: 'fixed', bottom: '30px', right: '30px', background: '#007bff',
            color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer',
            zIndex: '9999', fontSize: '25px'
        });

        const chatBox = document.createElement('div');
        Object.assign(chatBox.style, {
            position: 'fixed', bottom: '80px', right: '20px', width: '330px', height: '430px',
            background: 'white', border: '1px solid #ccc', borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)', display: 'none', flexDirection: 'column',
            zIndex: '9999', fontFamily: 'Arial, sans-serif'
        });

        const phoneContainer = document.createElement('div');
        Object.assign(phoneContainer.style, {
            flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', padding: '20px', boxSizing: 'border-box', textAlign: 'center'
        });

        const phoneLabel = document.createElement('div');
        phoneLabel.textContent = 'Enter your phone number';
        phoneLabel.style.marginBottom = '10px';

        const phoneInput = document.createElement('input');
        phoneInput.type = 'text';
        phoneInput.placeholder = 'e.g. 01712345678';
        Object.assign(phoneInput.style, {
            width: '80%', padding: '8px', fontSize: '16px',
            borderRadius: '4px', border: '1px solid #ccc', outline: 'none', textAlign: 'center'
        });

        const errorMsg = document.createElement('div');
        Object.assign(errorMsg.style, {
            color: 'red',
            fontSize: '12px',
            marginTop: '5px',
            display: 'none',
        });

        const phoneSubmit = document.createElement('button');
        phoneSubmit.textContent = 'Start Chat';
        Object.assign(phoneSubmit.style, {
            padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none',
            borderRadius: '4px', cursor: 'pointer', fontSize: '16px', marginTop: '15px'
        });

        phoneContainer.appendChild(phoneLabel);
        phoneContainer.appendChild(phoneInput);
        phoneContainer.appendChild(errorMsg);
        phoneContainer.appendChild(phoneSubmit);

        const chatHeader = document.createElement('div');
        Object.assign(chatHeader.style, {
            backgroundColor: '#ebe8e8ff',
            color: '#292828ff',
            padding: '10px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '15px',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            fontFamily: 'Arial, sans-serif',
        });

        const logo = document.createElement('div');
        Object.assign(logo.style, {
            width: '25px',
            height: '25px',
            backgroundColor: '#646363ff',
            borderRadius: '50%',
            marginRight: '10px',
        });
        chatHeader.appendChild(logo);

        const title = document.createElement('div');
        title.textContent = 'Chat User';
        title.style.flexGrow = '1';
        chatHeader.appendChild(title);

        const closeBtn = document.createElement('div');
        closeBtn.textContent = '×';
        Object.assign(closeBtn.style, {
            cursor: 'pointer',
            fontSize: '1.5em',
            fontWeight: 'bold',
            userSelect: 'none',
        });
        closeBtn.onclick = () => {
            chatBox.style.display = 'none';
        };
        chatHeader.appendChild(closeBtn);

        const messages = document.createElement('div');
        Object.assign(messages.style, {
            flex: '1', padding: '10px', overflowY: 'auto', display: 'none', fontSize: '14px'
        });

        const inputContainer = document.createElement('div');
        Object.assign(inputContainer.style, {
            display: 'none', borderTop: '1px solid #ccc', padding: '10px',
            boxSizing: 'border-box', display: 'flex'
        });

        const messageInput = document.createElement('input');
        messageInput.type = 'text';
        messageInput.placeholder = 'Type your message...';
        Object.assign(messageInput.style, {
            flex: '1', padding: '10px', fontSize: '14px', borderRadius: '4px 0 0 4px',
            border: 'none', borderRight: 'none', outline: 'none'
        });

        const sendButton = document.createElement('button');
        sendButton.textContent = '➤';
        Object.assign(sendButton.style, {
            fontSize: '30px', color: 'black', border: 'none', cursor: 'pointer', background: '#ffffff'
        });

        inputContainer.appendChild(messageInput);
        inputContainer.appendChild(sendButton);

        chatBox.appendChild(phoneContainer);
        chatBox.appendChild(chatHeader);
        chatBox.appendChild(messages);
        chatBox.appendChild(inputContainer);

        document.body.appendChild(chatButton);
        document.body.appendChild(chatBox);

        chatButton.onclick = () => {
            if (chatBox.style.display === 'none' || chatBox.style.display === '') {
                chatBox.style.display = 'flex';
                if (!phone) {
                    showPhoneInput();
                } else {
                    showChatUI();
                    if (!socket) initSocket();
                }
            } else {
                chatBox.style.display = 'none';
            }
        };

        function showPhoneInput() {
            phoneContainer.style.display = 'flex';
            messages.style.display = 'none';
            inputContainer.style.display = 'none';
            phoneInput.focus();
        }

        function showChatUI() {
            phoneContainer.style.display = 'none';
            chatHeader.style.display = 'flex';
            messages.style.display = 'flex';
            messages.style.flexDirection = 'column';
            inputContainer.style.display = 'flex';
            messageInput.focus();
        }

        phoneSubmit.onclick = () => {
            const val = phoneInput.value.trim();
            if (!val) {
                errorMsg.textContent = 'Please enter your phone number';
                errorMsg.style.display = 'block';
                phoneInput.focus();
                return;
            }
            errorMsg.style.display = 'none';
            phone = val;
            sessionStorage.setItem('chat_phone_agent', phone);
            showChatUI();
            if (!socket) initSocket();
        };

        function initSocket() {
            socket = io(APP_URL, {
                query: { token, userPhone: phone, type: 'agent' }
            });

            let currentPage = 1;
            const limit = 20;
            loadMessages();
            let receiverPhone = '';

            function loadMessages(page = 1) {
                socket.emit('get_messages', { page, limit });
            }

            socket.on('connect', () => {
                console.log('Connected to chat server as', phone);
            });

            socket.on('messages', (data) => {
                console.log('Received paginated messages:', data);
                receiverPhone = data.senderPhone;
                if (data?.messages?.length > 0 || data != null) {
                    appendMessagesToChat(data.messages);
                    currentPage = data.page;
                }
            })

            socket.on('new_message', (msg) => {
                receiverPhone = msg.senderPhone;
                console.log('new_message: ', msg);
                title.textContent = msg?.senderPhone ?? 'Chat User';
                addMessage(msg, false);
            });

            sendButton.onclick = sendMessage;
            messageInput.onkeydown = (e) => {
                if (e.key === 'Enter') sendMessage(receiverPhone);
            };
        }

        function sendMessage(receiverPhone) {
            const msg = messageInput.value.trim();
            if (!msg) return;
            addMessage(msg, true);
            socket.emit('send_message', { message: msg, receiverPhone });
            messageInput.value = '';
        }

        function addMessage(msg, isMine) {
            const msgDiv = document.createElement('div');
            const messageText = typeof msg === 'string' ? msg : msg.content;
            msgDiv.textContent = messageText;

            msgDiv.style.display = 'inline-block';
            msgDiv.style.marginBottom = '8px';
            msgDiv.style.padding = '6px 10px';
            msgDiv.style.borderRadius = '10px';
            msgDiv.style.wordBreak = 'break-word';
            msgDiv.style.whiteSpace = 'pre-wrap';

            if (isMine) {
                msgDiv.style.backgroundColor = '#dcf8c6';
                msgDiv.style.alignSelf = 'flex-end';
            } else {
                msgDiv.style.backgroundColor = '#f1f0f0';
                msgDiv.style.alignSelf = 'flex-start';
            }
            messages.appendChild(msgDiv);
            messages.scrollTop = messages.scrollHeight;
        }

        function appendMessagesToChat(messageList) {
            messageList.map((msg, i) => {
                const isMine = msg.from == 'user' ? true : false;
                const msgDiv = document.createElement('div');
                const messageText = typeof msg === 'string' ? msg : msg.message;
                msgDiv.textContent = messageText;

                msgDiv.style.display = 'inline-block';
                msgDiv.style.marginBottom = '8px';
                msgDiv.style.padding = '6px 10px';
                msgDiv.style.borderRadius = '10px';
                msgDiv.style.wordBreak = 'break-word';
                msgDiv.style.whiteSpace = 'pre-wrap';

                if (isMine) {
                    msgDiv.style.backgroundColor = '#dcf8c6';
                    msgDiv.style.alignSelf = 'flex-end';
                } else {
                    msgDiv.style.backgroundColor = '#f1f0f0';
                    msgDiv.style.alignSelf = 'flex-start';
                }
                messages.appendChild(msgDiv);
                messages.scrollTop = messages.scrollHeight;
            });
        }
    }
})();