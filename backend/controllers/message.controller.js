import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const {message} = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id; // Get the senderId from the authenticated user
        
        // Check if the message is empty
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Create a new message object
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });
        
        // Save the message to the conversation
        if (newMessage) {
            conversation.messages.push(newMessage._id);
           
        }

        //SOCKET IO FUNCTIONALITY WILL GO HERE
        //await conversation.save();
        //await newMessage.save();
        //this is the same as above
        // Save both the conversation and the new message   
        await Promise.all([
            conversation.save(),
            newMessage.save(),
        ]);

        res.status(201).json({newMessage});


    } catch (error) {
        console.error("Error sending message:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
    };



export const getMessage = async (req, res) => {
    try {
        const {id:userToChatId}=req.params;
        const senderId = req.user._id; // Get the senderId from the authenticated user

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");//populate messages THE MESSAGE ID WITH THE MESSAGE OBJECT

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        res.status(200).json(conversation.messages);
    
}    catch (error) {
        console.error("Error getting messages:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
    };  
    