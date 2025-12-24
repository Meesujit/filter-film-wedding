import { driveService } from "../google-drive.server";
import { ContactMessage } from "@/app/types/contact-message";
import { v4 as uuidv4 } from "uuid";

export const contactService = {
    async getAllMessages(): Promise<ContactMessage[]> {
        try{
            const messages = await driveService.getCollection<ContactMessage>("contact");
            return messages;
        } catch (error) {
            console.error("Error fetching contact messages:", error);
            return [];
        }
    },

    async createMessage(messageData: Omit<ContactMessage, "id" | "createdAt">): Promise<ContactMessage> {
        const messages = await this.getAllMessages();
        const newMessage: ContactMessage = {
            id: uuidv4(),
            ...messageData,
            createdAt: new Date().toISOString(),
        };
        messages.push(newMessage);
        await driveService.saveCollection("contact", messages);
        return newMessage;
    },

    async deleteAllMessages(): Promise<boolean> {
        try {
            await driveService.saveCollection("contact", []);
            return true;
        } catch (error) {
            console.error("Error deleting all contact messages:", error);
            return false;
        }
    },

    async deleteMessage(id: string): Promise<boolean> {
        const messages = await this.getAllMessages();
        const msgIndex = messages.findIndex(m => m.id === id);
        if (msgIndex === -1) return false;
        messages.splice(msgIndex, 1);
        await driveService.saveCollection("contact", messages);
        return true;
    },

    async updateMessage(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage | null> {
        const messages = await this.getAllMessages();
        const msgIndex = messages.findIndex(m => m.id === id);
        if (msgIndex === -1) return null;
        messages[msgIndex] = {
            ...messages[msgIndex],
            ...updates,
        };
        await driveService.saveCollection("contact", messages);
        return messages[msgIndex];
    },

}
