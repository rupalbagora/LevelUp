Websockets

without websocket

client       ----------->   server (running node.js)

client send request to the server and server give response and we close the req-res cycle.

yha hm req-res cycle close kr rhe hai ab agr kuch info firse send krna hai toh firse req send krni pdegi.


---


Chat application

let say mujhe chat application bnani hai ab mene koi msg send kiya apne frnd ko pr me directly communicate nhi kr skti me apn amsg server e through pass krungi.

user1--------->server<-------user2
user1 ne msg send kiya pr user2 ko kese pta chlega ki koi msg send kiya hai kyuki msg toh server ke pass gya hai.

toh ek tareeka yh hai ki me apne user ko bolu ki br br server se pucho ky mere liye koi msg hai?

basically har user server se har sec jakr puch rha hai ky mere liye koi msg hai.

is chiz ko hm polling bolte hai.

polling bohot jyda load increase kr skta hai server pr.

------

isse better hota hai websockets

client  http req. send krta hai and bolta hai ki mujhe connection bna kr rkhna hai server se. Server respond krega ki okk me tumhare sth websocket connection bna lunga.

server upgrade krta hai ur bolta hai me tumhe ek http req. send kr rha hu tum isko upgrade kr do websockets me.

ab yh connection close nhi hoga , jb chahe server response bhej skta hai jb chahe client req send kr skta hai har req ke bd connection close nhi hota jb tk tum na chaho


hm http req bhejte hai and headers me bolte hai mujhe upgrade krna hai websockets me server us req ko handle krta hai and hmare liye websocket connection establish ho jata hai.

Upgrade - The http 1.1 Upgrade header can be used to upgrade an already established client/server connection to a different protocol (over the same transport protocol)

For ex - it can be used by a client to upgrade a connection from HTTP 1.1 to HTTP 2.0 or an HTTP or HTTPS connection into a WebSocket.

What are WebSockets?
💡 Simple definition:

WebSockets are a way to create a continuous, two-way connection between client (browser) and server.

🧃 Real-life analogy
❌ HTTP (normal API)

Like ordering food:

You → order
Waiter → response
Connection ends
✅ WebSocket

Like a phone call 📞:

You connect once
Then both sides talk anytime
No need to reconnect
--------
🔌 3. How WebSockets work (step-by-step)
1️⃣ Handshake (important)

It starts as HTTP, then upgrades:

HTTP → WebSocket (upgrade)

👉 This is done using special headers

2️⃣ Connection stays open
Client  <=====================>  Server
        (persistent connection)

👉 This stays alive

3️⃣ Data flows both ways
Client → Server
Server → Client

Anytime ⚡