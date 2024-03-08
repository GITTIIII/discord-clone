import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ServerSidbarProps{
    serverId: string;
}

export const ServerSidebar = async ({
    serverId
}: ServerSidbarProps) =>{
    const profile = await currentProfile(); 

    if(!profile){
        return redirect("/")
    }
    
    const server = await db.server.findUnique({
        where:{
            id: serverId,
        },
        include: {
            channels: {
                orderBy:{
                    createAt: "asc",
                },
            },
            members:{
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc",
                }
            }
        }
    });

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VEDIO)
    const members = server?.members.filter((member) => member.profileId !== profile.id)

    if(!server){
        return redirect("/");
    }

    const role = server.members.find((memeber) => memeber.profileId === profile.id)?.role;

    return (
        <div>
            Server Sidebar
        </div>
    )
}