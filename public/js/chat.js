const socket = io()

socket.on('message',(message)=>{
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    //console.log(msg.value)
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
})