import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

import { Button } from '@/src/components/custom-button';
import { ImageCarousel } from '@/src/components/image-carousel';

import { FaPlay } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";

export default async function ActivityDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const activityDoc = await getDoc(doc(db, 'Activity', id));
    const activityData = activityDoc.exists() ? activityDoc.data() : null;

    if (!activityData) {
        return (
            <div className="flex h-full bg-white flex-col p-6">
                <h1 className="text-2xl font-bold text-gray-900">Activity not found</h1>
            </div>
        );
    }

    return (
        <div className="flex h-full bg-white flex-col text-gray-900">
            <ImageCarousel images={activityData["Gallery"] || []} />
            <div className="p-6 flex flex-col gap-1 flex-1 overflow-y-auto">
                <h1 className="text-2xl font-bold text-gray-900">{activityData["Title"]}</h1>
                <div>{activityData["Description"]}</div>
            </div>
            <div className="p-6 pt-0 flex w-full flex-col gap-2">
                <Button className="w-full"><FaPlay />Avvia</Button>
                <div className="flex flex-row w-full gap-2">
                    <Button className="w-full"><FaCalendarAlt />Partecipa</Button>
                    <Button className="w-full"><FaBookmark />Salva</Button>
                </div>
            </div>
        </div>
    );
}
