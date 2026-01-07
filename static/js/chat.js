document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('prompt-input');
    const promptSubmit = document.getElementById('prompt-submit');
    const chatModal = document.getElementById('chat-modal');
    const closeChat = document.getElementById('close-chat');
    const chatBackdrop = document.getElementById('chat-backdrop');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSubmit = document.getElementById('chat-submit');
    const suggestedQuestions = document.querySelectorAll('.suggested-question');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    let conversationId = null;

    // Helper to generate UUID
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Initialize/Reset Chat
    function initChat() {
        conversationId = generateUUID();
        chatMessages.innerHTML = '';
    }

    function openModal() {
        initChat();
        chatModal.classList.remove('hidden');
        chatModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        if (mobileMenuBtn) mobileMenuBtn.classList.add('hidden');
        chatInput.focus();
    }

    function closeModal() {
        chatModal.classList.add('hidden');
        chatModal.classList.remove('flex');
        document.body.style.overflow = '';
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('hidden');
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = `max-w-[85%] rounded-2xl px-5 py-3 ${sender === 'user'
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-white/10 text-gray-200 rounded-bl-none text-left'
            }`;

        if (sender === 'bot') {
            // Parse Markdown if marked is available, otherwise just text
            if (typeof marked !== 'undefined') {
                const renderer = new marked.Renderer();
                renderer.link = function (href, title, text) {
                    let linkHref = href;
                    let linkTitle = title;
                    let linkText = text;

                    if (typeof href === 'object' && href !== null) {
                        const token = href;
                        linkHref = token.href;
                        linkTitle = token.title;
                        if (this.parser && token.tokens) {
                            linkText = this.parser.parseInline(token.tokens);
                        } else {
                            linkText = token.text;
                        }
                    }

                    return `<a target="_blank" rel="noopener noreferrer" href="${linkHref}" title="${linkTitle || ''}">${linkText}</a>`;
                };
                contentDiv.innerHTML = marked.parse(text, { renderer: renderer });
            } else {
                contentDiv.textContent = text;
            }
            contentDiv.classList.add('prose', 'prose-invert', 'prose-sm', 'max-w-none');
        } else {
            contentDiv.textContent = text;
        }

        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addLoadingIndicator() {
        const id = 'loading-' + Date.now();
        const messageDiv = document.createElement('div');
        messageDiv.id = id;
        messageDiv.className = 'flex justify-start';
        messageDiv.innerHTML = `
            <div class="bg-white/10 text-gray-200 rounded-2xl rounded-bl-none px-5 py-4 flex items-center gap-2">
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeLoadingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    async function sendMessage(text) {
        if (!text.trim()) return;

        addMessage(text, 'user');
        const loadingId = addLoadingIndicator();

        try {
            const params = new URLSearchParams();
            params.append('question', text);
            params.append('conversationId', conversationId);

            const response = await fetch('https://resumebot.rpilab.dev/chat', {
                method: 'POST',
                body: params
            });

            removeLoadingIndicator(loadingId);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text(); // API returns text/markdown
            addMessage(data, 'bot');

        } catch (error) {
            console.error('Error:', error);
            removeLoadingIndicator(loadingId);
            addMessage("Sorry, I'm having trouble connecting right now. Please try again later.", 'bot');
        }
    }

    // Event Handlers
    function handlePromptSubmit() {
        const text = promptInput.value.trim();
        if (text) {
            openModal();
            promptInput.value = '';
            sendMessage(text);
        }
    }

    function handleChatSubmit() {
        const text = chatInput.value.trim();
        if (text) {
            chatInput.value = '';
            sendMessage(text);
        }
    }

    // Listeners
    promptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handlePromptSubmit();
    });

    promptSubmit.addEventListener('click', handlePromptSubmit);

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChatSubmit();
    });

    chatSubmit.addEventListener('click', handleChatSubmit);

    closeChat.addEventListener('click', closeModal);
    chatBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !chatModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    suggestedQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            promptInput.value = btn.innerText;
            handlePromptSubmit();
        });
    });

    // Handle mobile virtual keyboard
    if (window.visualViewport) {
        const handleVisualViewportResize = () => {
            // Only apply on mobile/tablet (matches the lg breakpoint used in HTML)
            if (window.innerWidth >= 1024) {
                chatModal.style.height = '';
                chatModal.style.top = '';
                return;
            }

            if (!chatModal.classList.contains('hidden')) {
                // Resize the modal wrapper to match the visual viewport
                // This prevents the keyboard from covering the bottom part
                chatModal.style.height = `${window.visualViewport.height}px`;
                chatModal.style.top = `${window.visualViewport.offsetTop}px`;

                // Ensure messages are scrolled to bottom after layout update
                requestAnimationFrame(() => {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                });
            }
        };

        window.visualViewport.addEventListener('resize', handleVisualViewportResize);
        window.visualViewport.addEventListener('scroll', handleVisualViewportResize);
    }
});
