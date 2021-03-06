// * This file is used to notify admin about new song playing.
import axios from "axios";
import { TextChannel, MessageEmbed } from "discord.js";

const songsInfoUri = "http://aska.ru-hoster.com:2199/external/rpc.php?m=recenttracks.get&username=onf&charset=&since=0&mountpoint=&rid=onf&limit=3&_=1599816324170"

export default class {

    private notificationsChannel: TextChannel;
    private lastSongTime!: number;

    constructor(channel: TextChannel) {
        this.notificationsChannel = channel;
    }

    private async sendNotification(song: any) {
        if (this.lastSongTime != song.time) {

            let notificationEmbed: MessageEmbed = new MessageEmbed({
                title: `🔔 Song Playing: ${song.title}`,
            });

            notificationEmbed.setColor("#14AACC");

            let imageRegex = new RegExp(/(\.png|.jpeg|.jpg|.gif)$/i);

            if (song.image && imageRegex.test(song.image)) {
                
                notificationEmbed.setThumbnail(song.image);
            }

            if (song.album && song.album != "") {
                notificationEmbed.addField(`💽 Album:`, song.album, false);
            }

            if (song.artist) {
                notificationEmbed.addField(`©️ By:`, song.artist, false);

            }
            this.lastSongTime = song.time;

            let message = await this.notificationsChannel.send(notificationEmbed);
            message.react("👍");
            message.react("👎");
        }
    }
    // Watch for changes
    async watch() {
        /* 
            TODO:
            1. Get list of songs
            2. Parse time for the next song
            3. Set timeout for notification
            4. Send info about song
            5. Repeat
        */

        while (true) {
            const response = await axios.get(songsInfoUri);

            const currentSong = response.data.data[0][0]; // Get last song in list
            
            await setTimeout(async () => await this.sendNotification(currentSong), 1000 * 5);
        }
    }
}