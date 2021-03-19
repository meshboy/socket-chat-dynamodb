export type Chat = {
  message: string,
  messageType: string,
  senderId: string,
  recipientId: string,
  timeCreated: number,
};

export const ChatTopics = {
  OneToOneMessage: "OneToOneMessage",
};
