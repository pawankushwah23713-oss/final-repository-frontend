import SockJS from "sockjs-client";
import Stomp from "stompjs";

useEffect(() => {
  const socket = new SockJS("https://final-repository-3.onrender.com/ws");
  const stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {

    stompClient.subscribe("/user/queue/notifications", (msg) => {
      alert("🔔 " + msg.body);
    });

  });

}, []);
