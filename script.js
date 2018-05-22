function getRandom() {
  var charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var charSetSize = charSet.length;
  var charCount = 8;
  var id = '';
  for (var i = 1; i <= charCount; i++) {
    var randPos = Math.floor(Math.random() * charSetSize);
    id += charSet[randPos];
  }
  return id;
}

function Subject() {
  this.list = [];
}

Subject.prototype.subscribe = function (observer) {
  this.list.push(observer);
}

Subject.prototype.update = function (message) {
  for (let i = 0; i < this.list.length; i++) {
    this.list[i].update(message);
  }
}

function ChatApp() {
  this.tabs = [];
  this.subject = new Subject();
}

ChatApp.prototype.addTab = function (tab) {
  this.tabs.push(tab);
}

ChatApp.prototype.sendMessage = function (textInputId, sender) {
  const textElem = document.getElementById(textInputId);
  const text = textElem.value;
  if (!text) {
    return alert('Enter message');
  }
  this.subject.update({ sender, text });
}

ChatApp.prototype.createTab = function (chatApp, name) {

  const getMessage = (message, sender) => {
    return `<div class="flex h-center f-start">
    <div>
    <strong>${sender}:</strong>
    </div>
    <div>
      ${message}
    </div>
  </div>`;
  };

  const header = (name = 'test') => {
    return `<div class="tab-header">
            ${name}
          </div>`;
  };

  const chats = (list) => {
    const chats = [];
    for (let i = 0; i < list.length; i++) {
      chats.push(getMessage(list[i].message, list[i].sender));
    }
    return `<div class="chat-box">${chats.join("")}</div>`;
  };

  const input = () => {
    const inputId = `textInput_${getRandom()}`;
    return `<div class="flex bottom">
        <input type='text' class='chat-input' id="${inputId}">
          ${button(inputId)}
      </div>`
  };

  const button = (textInputId) => {
    return `<button id="sendButton" onclick="return ChatApp.prototype.sendMessage('${textInputId}','${name}')">Send</button>`;
  };

  const getTab = (messageList, user) => {
    return `<div class="chat-tab">
        ${header(user)}
        <div class="flex messages">
          ${chats(messageList)}
          ${input()}
        </div>
    </div>`
  };

  function ChatTab(name) {
    this.messageList = [];
    this.user = name;
    this.tab = getTab(this.messageList, this.user);
    this.update = ({ sender, text }) => {
      this.messageList.push({
        sender: sender === name ? 'You' : sender,
        message: text
      });
      this.tab = getTab(this.messageList, this.user);
      chatApp.update();
    }
  }

  ChatApp.prototype = Object.create(chatApp);

  const newUserTab = new ChatTab(name);
  chatApp.subject.subscribe(newUserTab);
  chatApp.addTab(newUserTab);
}

ChatApp.prototype.update = function () {
  const main = document.getElementById('main');
  main.innerHTML = `<div class="flex f-space-around">${this.tabs.map(d => d.tab).join("")}</div>`;
}

function startChat() {
  const chatApp = new ChatApp();
  chatApp.createTab(chatApp, 'Tom');
  chatApp.createTab(chatApp, 'John');
  chatApp.createTab(chatApp, 'Sarah');
  chatApp.update();
}
