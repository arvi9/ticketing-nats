import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";
console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listner connected to NATS");

  stan.on("close", () => {
    console.log("NATS Connection Closed!");
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("accounting-service");

  const subsrciption = stan.subscribe(
    "ticket:created",
    "queue-group-name",
    options
  );
  subsrciption.on("message", (msg: Message) => {
    console.log("Message Received");
    const data = msg.getData();
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data:${data}`);
    }
    msg.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
