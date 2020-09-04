import nats, { Message } from "node-nats-streaming";
console.clear();

const stan = nats.connect("ticketing", "123", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listner connected to NATS");

  const subsrciption = stan.subscribe("ticket:created");
  subsrciption.on("message", (msg: Message) => {
    console.log("Message Received");
    const data = msg.getData();
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data:${data}`);
    }
  });
});
